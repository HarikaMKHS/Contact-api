import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for GitHub Pages
app.use(cors({
  origin: 'https://harikamkhs.github.io'  // ✅ your frontend origin
}));

app.use(express.json());

app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: subject || 'No Subject',
      text: message
    });

    res.send("success");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Email failed.");
  }
});

app.get('/', (req, res) => {
  res.send("Render contact API running.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
