require('dotenv').config();
const axios = require('axios');

const generatePlaylistDescription = async (userInput) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: `Create a playlist with the following criteria: ${userInput}` }
            ],
            max_tokens: 50,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        // return parsePlaylistResponse('Here are some upbeat workout songs for your playlist:\n\n1. "Can\'t Stop the Feeling!" by Justin Timberlake\n2. "Uptown Funk" by Mark Ronson ft. Bruno Mars\n3. "Don\'t Stop Believin"');
        return parsePlaylistResponse(response.data.choices[0].message.content);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

/**
 * @param response a string like: 'Here are some upbeat workout songs for your playlist:\n\n1. "Can\'t Stop the Feeling!" by Justin Timberlake\n2. "Uptown Funk" by Mark Ronson ft. Bruno Mars\n3. "Don\'t Stop Believin"'
 * @returns {{artist: *, name: *}[]}
 */
const parsePlaylistResponse = (response) => {
    const lines = response.split('\n').slice(2);
    return lines.map(line => {
        const [track, artist] = line.replace(/^\d+\.\s*/, '').split(' by ');
        return {artist, name: track.replace(/"/g, '')};
    });
};

module.exports = { generatePlaylistDescription };
