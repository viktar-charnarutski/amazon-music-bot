require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { generatePlaylistDescription } = require('./openaiService');
const { amazonMusicTrackIds, newPlaylist, appendTracks } = require('./amazonMusicService');

const app = express();
app.use(bodyParser.json());

app.post('/create-playlist', async (req, res) => {
    try {
        const { userInput } = req.body;
        const playlistDescription = await generatePlaylistDescription(userInput);
        const trackIds = await amazonMusicTrackIds(playlistDescription);
        const playlistId = await newPlaylist(userInput);
        const result = await appendTracks(playlistId, trackIds);
        res.json({
            success: result.data.data.appendTracks.id !== undefined,
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
