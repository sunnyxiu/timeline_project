require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" })); // Allow all origins
app.use(express.json());

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/classify", async (req, res) => {
    
    console.log("Request received");
    console.log("Request body:", req.body); // 確認收到的請求體
    try {
        const messages = req.body.selectedComment;

        // 打印接收到的資料
        console.log("Received messages:", messages);

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Invalid messages format" });
        }

        const formattedMessages = messages.flatMap((msg, index) => {
            const topics = [];
            if (msg["乘客權益"]) topics.push("乘客權益");
            if (msg["空服員負擔"]) topics.push("空服員負擔");
            if (msg["寵物的動物福利"]) topics.push("寵物的動物福利");
            if (msg["肇事責任歸屬"]) topics.push("肇事責任歸屬");
            if (msg["國際經驗參考"]) topics.push("國際經驗參考");
            if (msg["具體建議"]) topics.push("具體建議");
            if (msg["寵物定義釐清"]) topics.push("寵物定義釐清");
            if (topics.length === 0) topics.push("其他");
        
            const category = msg["贊成論點/其他想法"] === "贊成論點" ? "贊成論點" : "其他想法";
        
            // 將每個觀點拆分成獨立的留言
            return topics.map(topic => `留言 (${category}): ${msg["留言內容"]} (${topic})`);
        }).join("\n");
        
        console.log(formattedMessages);

        const prompt = `
        以下是一些留言，已清楚標記是否屬於「贊成論點」或「其他想法」，以及對應的觀點標記。請根據標記進行分類統整，做各觀點分類留言內容統整摘要(每個觀點分類不超過50字)，並以以下格式輸出結果。
        觀點分類類別包含 乘客權益, 空服員負擔, 寵物的動物福利, 肇事責任歸屬, 國際經驗參考, 具體建議, 寵物定義釐清, 其他 8種

        範例格式：
        <div>
        <strong>贊成論點的留言總結</strong>
        <ul>
        <li>[觀點分類]：該觀點的統整內容</li>
        <li>[觀點分類]：該觀點的統整內容</li>
        </ul>
        </div>
        <div>
        <strong>其他想法的留言總結</strong>
        <ul>
        <li>[觀點分類]：該觀點的統整內容</li>
        <li>[觀點分類]：該觀點的統整內容</li>
        </ul>
        </div>

        留言資料：
        ${formattedMessages}`

        const result = await model.generateContent(prompt);

        const responseText = typeof result.response.text === "function"
            ? result.response.text()
            : result.response.text;

        res.json({ response: responseText });
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));