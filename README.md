# 🔍 Chargeback Analyzer App

A local web application that uses **Google Gemini 2.0 Flash** to analyze chargeback claims for car rental receipts.

---

## 🚀 Features

- Upload **multiple rental receipt PDFs**
- Upload corresponding:
  - 📄 Settlement Data (CSV)
  - ⚠️ Chargeback Data (CSV)
  - ✅ Authorization Data (CSV)
- Matches and analyzes by **Rental Number**
- Uses **Gemini AI** to recommend:
  - ✅ DEFEND or ❌ ACCEPT
- Scrollable result panel with reasoning
- Built with **Node.js**, **Express**, **Bootstrap**, and **Google Gemini**

---

## 🧰 Tech Stack

- Node.js + Express.js
- pdf-parse + csv-parser
- Google Gemini 2.0 Flash API
- Bootstrap 5 (Frontend)
- dotenv for API key handling

---

## 🖥️ Local Setup

### 1. Clone the Repo

```bash
git clone https://github.com/YOUR_USERNAME/chargeback-analyzer-app.git
cd chargeback-analyzer-app

## 1. AUTH DATA, SETTLEMENT DATA, CB DATA - DMP 
## 2. FILENET SIGNED RENTAL RECEIPTS 
## 3. CB NOTIFICATION EMAIL READ, ATTACHMENTS 

## READ CB NOTIFICATION > USE AUTH,SETTLEMENT,CB DATA, RENTAL RECEIPTS > ANALYZE > DEFEND/ACCEPT > CONFIDENCE SCORING > SUMMARY + SCORE > HITL > INITIATE EMAIL PREP > GENERATE EMAIL > HITL  USER ACCEPT AND INITIATE THE EMAIL 

## MVP 
## 1. AUTH DATA, SETTLEMENT DATA, CB DATA - DMP 
## 2. USER UPLOAD - SIGNED RENTAL RECEIPTS OR ANY SUPPORTING DOCUMENTATION 
## 3. CB NOTIFICATION - CB REASON/TEXT UPLOAD 

## READ CB NOTIFICATION > USE AUTH,SETTLEMENT,CB DATA, RENTAL RECEIPTS > ANALYZE > DEFEND/ACCEPT > CONFIDENCE SCORING > SUMMARY + SCORE > HITL > INITIATE EMAIL PREP > GENERATE EMAIL > HITL  USER ACCEPT AND INITIATE THE EMAIL 

