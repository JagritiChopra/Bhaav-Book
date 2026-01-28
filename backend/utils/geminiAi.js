// import { GoogleGenerAI } from "@google/generai";
// import dotenv from "dotenv";
// dotenv.config();

// const genAI = new GoogleGenerAI(process.env.GEMINI_API_KEY);



import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// The variable name is usually 'genAI' by convention
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// To use the model:
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function main(entryText, imageUrls = null, attachmentUrls = null, isShort = false) {
    if (!entryText) {
        console.error("Error: entryText is required.");
        return;
    }

    // Initialize the model correctly
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", // or "gemini-1.5-pro"
        generationConfig: { responseMimeType: "application/json" } 
    });

    const lengthInstruction = isShort
        ? "Keep each section under 250 words. Be concise."
        : "Be detailed and expressive where needed.";

    // Fix the JSON structure in the prompt to be valid template
    const promptText = `
    Analyze these journal entries: ${entryText}
    ${lengthInstruction}
    
    Return ONLY a JSON object with this exact structure:
    {
        "sentiment": "positive | neutral | negative",
        "emotions": [],
        "insight": "",
        "mistakes": "",
        "suggestion": "",
        "isUserStuck": "Yes/No description",
        "waysToGetUnstuck": "",
        "moodInImage": "",
        "attachmentSummary": ""
    }`;

    try {
        const parts = [{ text: promptText }];

        // Handle Images
        if (imageUrls?.length > 0) {
            for (const url of imageUrls) {
                const res = await fetch(url);
                const buffer = await res.arrayBuffer();
                parts.push({
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: Buffer.from(buffer).toString("base64"),
                    },
                });
            }
        }

        // Send request
        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
        });

        const response = await result.response;
        return response.text(); // This contains your JSON string
    } catch (error) {
        console.error("Error during Gemini analysis:", error);
    }
}


// import {
//     GoogleGenAI,
// } from "@google/genai";
// import dotenv from "dotenv";
// dotenv.config();

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// console.log("Gemini AI initialized");

// async function main(entryText, imageUrls = null, attachmentUrls = null, isShort = false) {
//     if (!entryText) {
//         console.error("Error: entryText and imageUrl are required.");
//         return;
//     }

//     const lengthInstruction = isShort
//         ? "Keep each section (insight, suggestion, etc.) under 250 words. Be concise but emotionally intelligent and clear."
//         : "Be detailed and expressive where needed.";

//     const promptTextPart = {
//         text: `You are a helpful and empathetic mental wellness assistant.

//     You are given a set of personal journal entries written over the past several days (which may include transcribed voice or video logs) AND an associated image.

//     <<<START OF USER ENTRIES>>>
//     ${entryText}
//     <<<END OF USER ENTRIES>>>

//     [The image provided alongside this text gives additional context to the user's state or environment during this period.]

//     ${lengthInstruction}

//     Your task is to deeply analyze the emotional, psychological, and behavioral state of the user **across these entries and considering the image combined**, and return the result in the following **structured JSON** format.

//     Instructions:
//     - Determine the **overall emotional tone** ("sentiment") of the user during this time — is it mostly positive, neutral, or negative?
//     - Extract all **meaningful emotions** expressed in the entries. These could include feelings like "anxious", "grateful", "lonely", "motivated", etc.
//     - Detect if the user seems to be **struggling**, emotionally stuck, or showing signs of burnout, confusion, or depression.
//     - Summarize any clear **patterns, changes**, or emotional shifts that appear over time.
//     - Provide an **insight** that helps the user reflect on their current phase of life in 2–4 sentences.
//     - Offer an **actionable suggestion** based on your analysis.
//         - If the emotions were mostly negative, suggest something healing or uplifting:
//         like taking a break, traveling, doing creative activities, talking to a psychologist, spending time in nature, or resting.
//         Mention how it may help in 3–4 sentences.
//         - If emotions were positive, suggest something celebratory or reinforcing:
//         like rewarding oneself, journaling gratitude, sharing joy, setting new goals, or enjoying the moment more fully.
//         - Keep suggestions real-world, empathetic, and practical.
//     - If the user seems stuck, suggest a way to get unstuck:
//         like talking to a friend, seeking professional help, or trying a new activity.
//         - If the user seems to be in a good place, suggest ways to maintain that state.
//         - If the user seems to be in a bad place, suggest ways to improve it.
//         - If the user seems to be in a neutral place, suggest ways to enhance their emotional state.

//     Return the result in **this JSON format only**:
//     {
//     "sentiment": "positive | neutral | negative",
//     "emotions": ["happy", "anxious", "overwhelmed"],
//     "insight": "Summarized emotional reflection and self-awareness",
    
//     "Mistakes": "List of any mistakes or missteps the user made during this period. Be specific and constructive. Mention how these mistakes may have affected their emotional state or well-being. Use 2–3 sentences.",
//     "suggestion": "Empathetic and constructive advice for the user that what they can do next to overcome their mistakes or maintain their good state. Give points on how to do it. Explain in 3–4 sentences. This should be actionable and realistic.",

//     "isUserStuck": Yes, You are stucked with.... / No, You are not stucked with anything.,
//     "waysToGetUnstuck": "Suggestions for getting unstuck or maintaining a good state",
//     "moodInImage": "happy | neutral | sad", (if the image not provided say "Image not provided")
//     "Attachment": "It's about...." (if the attachment not provided say "Attachment not provided")
//     }`
//     };

//     try {
//             const contents = [];

//             // Handle all images
//             if (imageUrls && imageUrls.length > 0) {
//                 for (const url of imageUrls) {
//                     const image = await fetch(url);
//                     const imageArrayBuffer = await image.arrayBuffer();
//                     const base64ImageData = Buffer.from(imageArrayBuffer).toString("base64");

//                     contents.push({
//                         inlineData: {
//                             mimeType: "image/jpeg", // You can dynamically detect type if needed
//                             data: base64ImageData,
//                         },
//                     });
//                 }
//             }

//             // Handle all attachments (e.g., PDFs)
//             if (attachmentUrls && attachmentUrls.length > 0) {
//                 for (const url of attachmentUrls) {
//                     const attachmentResponse = await fetch(url);
//                     const attachmentArrayBuffer = await attachmentResponse.arrayBuffer();
//                     const base64Attachment = Buffer.from(attachmentArrayBuffer).toString("base64");

//                     contents.push({
//                         inlineData: {
//                             mimeType: "application/pdf", // Again, can be extended for more types
//                             data: base64Attachment,
//                         },
//                     });
//                 }
//             }

//             // Add text prompts
//             contents.push(
//                 { text: promptTextPart.text },
//                 { text: lengthInstruction },
//                 {
//                     text: "Multiple images and/or documents have been provided. Analyze the user's facial expressions, body language, and context based on these visuals. Use them alongside the journal entries for your insight and suggestion."
//                 }
//             );

//             // Call Gemini
//             const response = await ai.models.generateContent({
//                 model: "gemini-1.5-pro-latest",
//                 contents,
//                 config: {
//                     systemInstruction: "You are a helpful and empathetic mental wellness assistant.",
//                 }
//             });
//             console.log("Generating content with text and images/attachments...");
//             // console.log("Response received:", response.text);
//             return response.text;
//         }
//     catch (error) {
//         console.error("Error during Gemini analysis:", error);
//     }
// }

 export { main as analyzeJournalWithGemini };