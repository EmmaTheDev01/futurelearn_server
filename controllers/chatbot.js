import axios from 'axios';
import ChatBot from '../models/ChatBot.js';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const handleChatMessage = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Make request to OpenAI API
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo', // Correct model specification
                messages: [
                    { role: 'user', content: message } // Correct message format
                ],
                max_tokens: 150, // Adjust the number of tokens as needed
                temperature: 0.7, // Adjust the temperature for randomness
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Extract the reply from the response
        const botReply = response.data.choices[0].message.content.trim();

        // Save the chat history in MongoDB
        await ChatBot.create({
            userMessage: message,
            botReply: botReply,
        });

        // Respond with the bot's reply
        return res.json({ reply: botReply });
    } catch (error) {
        console.error('Error communicating with OpenAI:', error);
        return res.status(500).json({ error: 'Failed to communicate with OpenAI API' });
    }
};
