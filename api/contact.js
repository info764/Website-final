// api/contact.js
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Set up Nodemailer transporter with Gmail
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,  // Use 465 for SSL (secure) or 587 for TLS
      secure: true,  // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: `${name} <${process.env.EMAIL_USER}>`,  // Sender (your Gmail)
      to: process.env.NOTIFY_EMAIL,  // Recipient (you)
      replyTo: email,  // User's email for easy reply
      subject: `New contact from ${name}`,
      text: `From: ${name} (${email})\n\nMessage:\n${message}`,  // Plain text version
      html: `
        <h1>New Message</h1>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,  // HTML version
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Success: Redirect to thank-you page
    res.setHeader('Location', '/thank-you.html');
    return res.status(302).end();
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
