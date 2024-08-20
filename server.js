require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const {aiGeneratedPlaylist} = require("./playlist");

const app = express();
app.use(bodyParser.json());

app.post('/create-playlist', async (req, res) => {
    try {
        const result = await aiGeneratedPlaylist(req.body);
        res.json({
            success: result.data.data.appendTracks !== undefined,
            playlistName: result.data.data.appendTracks.title,
            url: result.data.data.appendTracks.url,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'An error occurred while creating the playlist.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
