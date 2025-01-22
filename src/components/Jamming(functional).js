import './styles/Jamming(functional).module.css';
import Jamming from './Jamming(presentation)';
import { useState } from 'react';
import { searchArray, notInArray, removeFromArray } from '../utililty_functions/utils';
import { createPlaylist, getArtistId, getAlbums, getTracksArray, saveTracks, } from '../utililty_functions/authorization';

function JamSession() {
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
    if (playlistName !== '' && playlist.length > 0) {
      createPlaylist(playlistName)
      .then((resplay) => {
        getTracksArray(playlist).then(res => {
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
      getAlbums(artistId).then(res => setData(res.items));
    
  }
  
  return (
    <div>
      <Jamming result={data} playlist={playlist} handleClick1={handleClick1} handleClick2={handleClick2} handleSearch={handleSearch} search={search} handleSubmit1={handleSubmit1} playlistName={playlistName} handleSave={handleSave} handlePlaylistName={handlePlaylistName} />
    </div>
  );
}

export default JamSession;
