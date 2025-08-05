// server.js (Updated with PDF error handling)
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const csv = require('csv-parser');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
const upload = multer({ dest: 'uploads/' });

// HTML Form Endpoint
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post(
  '/analyze',
  upload.fields([
    { name: 'receiptPdf' },
    { name: 'settlementCsv' },
    { name: 'chargebackCsv' },
    { name: 'authCsv' },
  ]),
  async (req, res) => {
    try {
      // Parse PDFs with error handling
      const pdfFiles = req.files['receiptPdf'];
      const receiptTexts = {};

      for (const file of pdfFiles) {
        try {
          const buffer = fs.readFileSync(file.path);
          const text = (await pdfParse(buffer)).text;

          const match = text.match(/Rental Number:\s*(R\d{3,4})/);
          if (match) {
            receiptTexts[match[1]] = text;
          }
        } catch (err) {
          console.warn(`❌ Skipped unreadable PDF: ${file.originalname} — ${err.message}`);
        } finally {
          fs.unlinkSync(file.path);
        }
      }

      // Parse CSVs
      const parseCSV = (filePath) =>
        new Promise((resolve) => {
          const results = [];
          fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results));
        });

      const settlementData = await parseCSV(req.files['settlementCsv'][0].path);
      const chargebackData = await parseCSV(req.files['chargebackCsv'][0].path);
      const authData = await parseCSV(req.files['authCsv'][0].path);

      // Delete CSVs
      fs.unlinkSync(req.files['settlementCsv'][0].path);
      fs.unlinkSync(req.files['chargebackCsv'][0].path);
      fs.unlinkSync(req.files['authCsv'][0].path);

      const results = [];

      for (const rentalNumber in receiptTexts) {
        const settlement = settlementData.find(x => x.receipt_number === rentalNumber);
        const chargeback = chargebackData.find(x => x.receipt_number === rentalNumber);
        const auth = authData.find(x => x.receipt_number === rentalNumber);
    //adding debug statements     
        console.log("📄 Found receipt for:", rentalNumber);
        console.log(" - Settlement match:", !!settlement);
        console.log(" - Chargeback match:", !!chargeback);
        console.log(" - Auth match:", !!auth);
 
        if (!settlement || !chargeback || !auth) continue;

        const prompt = `Rental Receipt:\n${receiptTexts[rentalNumber]}\n\nSettlement Data: ${JSON.stringify(settlement)}\nChargeback Data: ${JSON.stringify(chargeback)}\nAuthorization Data: ${JSON.stringify(auth)}\n\nBased on this information, decide whether to DEFEND or ACCEPT the chargeback. Explain why.`;

        const geminiRes = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' +
            process.env.GEMINI_API_KEY,
          {
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }],
              },
            ],
          }
        );

        const aiReply =
          geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text ||
          'No response';

        results.push({
          rentalNumber,
          decision: aiReply,
        });
      }

      res.send(
        `<h3>Analysis Results:</h3><ul>${results
          .map(
            (r) =>
              `<li><strong>${r.rentalNumber}</strong>:<br/><pre>${r.decision}</pre></li>`
          )
          .join('')}</ul>`
      );
    } catch (err) {
      console.error(err);
      res.status(500).send('Error processing request');
    }
  }
);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
