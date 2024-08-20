const { generatePlaylistDescription } = require('./openaiService');
const { amazonMusicTrackIds, newPlaylist, appendTracks } = require('./amazonMusicService');


const aiGeneratedPlaylist = async (reqBody) => {
    const {userInput} = reqBody;
    const playlistDescription = await generatePlaylistDescription(userInput);
    const trackIds = await amazonMusicTrackIds(playlistDescription);
    const playlistId = await newPlaylist(userInput);
    return appendTracks(playlistId, trackIds);
}

module.exports = { aiGeneratedPlaylist };