# 🚀 Excited to share my latest project — a Temporary Email Generator 📨

This project allows users to generate disposable email addresses to receive emails for testing or temporary use. Each generated email address automatically expires in 10 minutes, ensuring both security and privacy.

## 🔧 Tech Stack & Workflow

- Django + DRF → Backend API to manage email addresses and messages
- Next.js → Frontend integration to display and refresh incoming emails
- aiosmtpd → Custom SMTP server to receive emails
- Custom SMTP Client → Built for testing email delivery

## ⚙️ How it works?

1. User clicks “Change” → A new temporary email address is generated.
2. aiosmtpd server receives emails from any SMTP client and stores them in the backend.
3.User clicks “Refresh” → The latest emails are fetched via API and displayed on the frontend.
4.Each email address automatically expires after 10 minutes.


[Watch Demo](test.mp4)


https://github.com/user-attachments/assets/2477459a-896d-4bc1-90ab-e1e09d967f3f

