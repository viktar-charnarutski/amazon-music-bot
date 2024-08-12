require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { generatePlaylistDescription } = require('./openaiService');
const { searchAmazonMusic, createPlaylistOnAmazon } = require('./amazonMusicService');

const app = express();
app.use(bodyParser.json());

app.post('/create-playlist', async (req, res) => {
    try {
        const { userInput } = req.body;

        // Generate playlist description using GPT-4
        const playlistDescription = await generatePlaylistDescription(userInput);

        // Search Amazon Music for tracks
        const tracks = await searchAmazonMusic(playlistDescription);
        const trackIds = tracks.map(track => track.id);

        // Create a new playlist on Amazon Music
        const playlist = await createPlaylistOnAmazon("My Custom Playlist", trackIds);

        res.json({
            success: true,
            playlistName: playlist.name,
            trackCount: trackIds.length,
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
