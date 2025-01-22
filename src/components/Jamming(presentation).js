import styles from './styles/Jamming(presentation).module.css';

const inputBar = { 
    backgroundColor:"black",
    border: '1px solid white',
    borderRadius: "5px",
    height: '34px',
    width: '250px',
    marginBottom: '20px',
    color: 'white'
};

function Jamming ({ result, playlist, handleClick1, handleClick2, search, handleSearch, handleSubmit1, handleSave, handlePlaylistName, playlistName }) {
    return (
        <div className={styles.main}>
            <h1 className={styles.title}>Jamming</h1>
            <div className={styles.maindiv}>
                <div className={styles.searchbar}>
                    <label htmlFor="input" style={{ fontSize: "25px", marginBottom:'20px' }}>Search:</label>
                    <input style={inputBar} type="text" id="input" placeholder='ArtistName' value={search} onChange={handleSearch} />
                    <input className={styles.submitButton} type='submit' value="Submit" onClick={handleSubmit1} />
                </div>
                <div className={styles.holder}>
                    <div className={styles.list}>
                        <h1>Results</h1>
                        <div className={styles.playlistDiv}>
                            {result.map((item) => {
                            return (
                            <div key={Math.random()} className={styles.songs} >
                                <h6>{item.name}</h6>
                                <p>{item.artists[0].name} | <span style={{ fontWeight: 'lighter'}}>{item.total_tracks}</span></p>
                                <p className={styles.add} onClick={handleClick1} id={item.id}>+</p>
                            </div>
                            )})}
                        </div>
                    </div>
                    <div className={styles.list}>
                        <h1>Playlist</h1>
                        <div className={styles.playlistDiv}>
                            {playlist.map((item) => {
                            return (
                            <div key={Math.random()} className={styles.songs} >
                                <h6>{item.name}</h6>
                                <p>{item.artists[0].name} | <span style={{ fontWeight: 'lighter'}}>{item.total_tracks}</span></p>
                                <p className={styles.add} onClick={handleClick2} id={item.id}>-</p>
                            </div>
                            )})}
                        </div>
                    </div>
                </div>
                <input type="text" className={styles.playlistName} value={playlistName} onChange={handlePlaylistName} placeholder='Playlist-Name' />
                <button className={styles.button} onClick={handleSave}>Save to Spotify</button>
            </div>
        </div>
    );
}

export default Jamming;