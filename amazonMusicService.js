const axios = require('axios');

const searchAmazonMusic = async (query) => {
    const response = await axios.get(`https://api.music.amazon.dev/v1/search/tracks`, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': '',
            'Authorization': ''
        },
        params: {
            query: query,
        },
    });

    return response.data.tracks.items;
};

const createPlaylistOnAmazon = async (playlistName, trackIds) => {
    const response = await axios.post(`https://api.amazonmusic.com/v1/playlists`, {
        title: playlistName,
        description: "Amazing Songs",
        visibility: "PRIVATE"
    }, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': '',
            'Authorization': ''
        },
    });

    return response.data;
};

module.exports = { searchAmazonMusic, createPlaylistOnAmazon };
