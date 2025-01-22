import './Playlist.css';
import Main from './Body';
import { useState } from 'react';
import { searchArray, notInArray, removeFromArray } from './utils';
import { createPlaylist, getAlbum, getArtistId, getTracks, getTracks1, getTracksUri, saveTracks, tracksUri } from './authorization';

function Playlist() {
  const [data, setData] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [search, setSearch] = useState("");
  const [artistId, setArtistId] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [albums, setAlbums] = useState([]);

  function handleSearch (e) {
    setSearch(e.target.value);
  }

  function handlePlaylistName (e) {
      setPlaylistName(e.target.value);
  }

  function handleClick1 (e) {
      const songName = searchArray(data, e.target.id);
      if (notInArray(playlist, songName))
        setPlaylist((prev) => [...prev, songName]);
  }

  function handleSave () {
    let playlist_id;
    if (playlistName !== '' && playlist.length > 0)
      createPlaylist(playlistName)
      .then((resplay) => {
        getTracks1(playlist).then(res => {
          setAlbums(res);
          playlist_id = resplay.id
          //saveTracks( resplay.id , getTracksUri(res))
        })
      })
      .then (() => {
        let arr = [];
        albums.forEach((i) => i.forEach((j) => arr.push(j.uri)));
        console.log(arr);
        console.log(playlist_id);
        saveTracks( playlist_id, arr );
      })
    }

  function handleClick2 (e) {
    setPlaylist((prev) => removeFromArray(prev, e.target.id));
  }

  function handleSubmit1 () {
    getArtistId(search)
    .then(res => setArtistId(res.artists.items[0].id))
    .catch(() => {
      alert('Artist Not found');
      return;
    });
    if (artistId !== '')
      getTracks(artistId).then(res => setData(res.items));
    console.log(data);
  }
  
  return (
    <div>
      <Main result={data} playlist={playlist} handleClick1={handleClick1} handleClick2={handleClick2} handleSearch={handleSearch} search={search} handleSubmit1={handleSubmit1} playlistName={playlistName} handleSave={handleSave} handlePlaylistName={handlePlaylistName} />
    </div>
  );
}

export default Playlist;
