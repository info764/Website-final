import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, phone, message } = req.body;

    try {
      // Create transporter with Gmail (App Password recommended)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,  // your Gmail
          pass: process.env.EMAIL_PASS   // Gmail App Password
        }
      });

      // Email content
      await transporter.sendMail({
        from: `"Concrete Crack Repair" <${process.env.EMAIL_USER}>`,
        to: process.env.NOTIFY_EMAIL,  // where you want submissions sent
        subject: "New Contact Form Submission",
        text: `
Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}
Message: ${message}
        `
      });

      return res.status(200).json({ success: true, message: "Form submitted successfully!" });
    } catch (err) {
      console.error("Email send error:", err);
      return res.status(500).json({ success: false, error: "Failed to send email" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
