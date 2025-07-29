// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// The API Route
app.post('/api/generate-plan', async (req, res) => {
    const { destination, startDate, endDate } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key is not configured on the server.' });
    }

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        const textPrompt = `
            You are a travel planner AI. A user is planning a trip to ${destination} for ${duration} days.
            Your task is to generate a comprehensive travel plan.
            1.  Create a detailed, day-by-day itinerary suggesting specific activities for the morning, afternoon, and evening of each day.
            2.  Create a packing checklist categorized by Clothing, Toiletries, Electronics, Documents, and Miscellaneous.
            3.  Suggest 3 accommodation options (hotels or hostels) with a brief description for each.
            4.  Provide a booking.com search URL for hotels in the destination.
            Return the response as a single, valid JSON object.
        `;
        const textApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const textPayload = {
            contents: [{ role: "user", parts: [{ text: textPrompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        };
        const textResponse = await fetch(textApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(textPayload)
        });
        const textResult = await textResponse.json();
        const planData = JSON.parse(textResult.candidates[0].content.parts[0].text);

        // Send the plan data
        res.json({ plan: planData });

    } catch (error) {
        console.error('Error on backend:', error);
        res.status(500).json({ error: 'Failed to generate plan from the backend.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
