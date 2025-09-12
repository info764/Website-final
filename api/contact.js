export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("Form data:", req.body);
    return res.status(200).json({ success: true, message: "Form received!" });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
