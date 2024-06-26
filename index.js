require('dotenv').config()
const express = require('express')
const { Configuration, OpenAI } = require('openai');


const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const history = []

app.post('/helpai', async (req, res) => {
    const message = req.body.message; 
    if (!message) {
      return res.status(400).send('No prompt provided');
    }
    history.push({role:"user", content: message})
    try {
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", 
        messages: history,
        max_tokens: 150,
      });
      const aiMessage = aiResponse.data.choices[0].message.content;
      history.push({ role: "chat-bot", content: aiMessage });

      res.json({ response: aiMessage });
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      res.status(500).send('Failed to fetch response from AI');
    }
});


app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});