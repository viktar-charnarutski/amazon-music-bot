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

        const parsedPlaylist = parsePlaylistResponse(response.data.choices[0].message.content);
        return parsedPlaylist;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

const parsePlaylistResponse = (response) => {
    // Split the response into lines
    const lines = response.split('\n').slice(1); // Remove the first line which is the introductory sentence

    // Parse each line into "Artist - Track Name"
    const parsedPlaylist = lines.map(line => {
        // Remove any leading numbering (e.g., "1. ") and split by " by "
        const [track, artist] = line.replace(/^\d+\.\s*/, '').split(' by ');

        // Return the formatted string "Artist - Track Name"
        return `${artist} - ${track}`;
    });

    return parsedPlaylist;
};

module.exports = { generatePlaylistDescription };
