import express from "express";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({});

app.post("/detect", upload.single("image"), async (req, res) => {
    try {
        const { text } = req.body;
       const instructions = `You are "Guardian AI", a fraud detection expert. 
        Analyze the following text or image for signs of scams, phishing, or fraud. 
        1. If it's a scam, say "SCAM DETECTED" in bold.
        2. Explain the red flags (like urgent language, suspicious links, or fake identity).
        3. Give advice on what to do next.
        If it's safe, say "LOOKS SAFE".`;
        
        // Agar text message hai
            let contents = [{ role: "user", parts: [{ text: instructions}] }];

            if (text) {
                contents[0].parts.push({ text: `user message to analyse: ${text}` });
            }

        // Agar image file hai (Screenshot)
        if (req.file) {
            contents[0].parts.push({
                inlineData: {
                    mimeType: req.file.mimetype,
                    data: req.file.buffer.toString("base64")
                }
            });
        }

          const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{role:"user",parts:userParts}],
  });
  console.log(response.text);


        res.json({ result: response.text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Backend running on port 3000"));
