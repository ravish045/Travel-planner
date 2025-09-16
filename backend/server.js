const express = require("express");
const fetch = require("node-fetch"); // works fine with node-fetch@2
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post("/api/generate-plan", async (req, res) => {
  try {
    const { destination, startDate, endDate } = req.body;

    const prompt = `Plan a travel itinerary for ${destination} from ${startDate} to ${endDate}.`;

    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    const plan =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No plan could be generated.";

    res.json({ plan });
  } catch (error) {
    console.error("❌ Error generating plan:", error);
    res.status(500).json({ error: "Failed to generate plan" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
