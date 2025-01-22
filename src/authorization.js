const redirect_uri = 'http://localhost:3000';

const AUTHORIZE = 'https://accounts.spotify.com/authorize';
const TOKEN = "https://accounts.spotify.com/api/token";

const scope = "user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private playlist-modify-public playlist-modify-private";
const authUrl = new URL(AUTHORIZE);

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

function sha256(plain) { 
    // returns promise ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(a) {
    // Convert the ArrayBuffer to string using Uint8 array.
    // btoa takes chars from 0-255 and base64 encodes.
    // Then convert the base64 encoded to base64url encoded.
    // (replace + with -, replace / with _, trim trailing =)
    return btoa(String.fromCharCode.apply(null, new Uint8Array(a)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const codeVerifier = generateRandomString(64);
const hashed = await sha256(codeVerifier);
const codeChallenge = base64urlencode(hashed);

export function requestAuthorization(client_id) {
    window.localStorage.setItem('code_verifier', codeVerifier);
    window.localStorage.setItem('code_challenge', codeChallenge);
    const params = {
        response_type: 'code',
        client_id: client_id,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirect_uri,
}

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
}

function accessCode () {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    return code;
}

export const getToken = async () => {
    let code = accessCode();
    const client_id = window.localStorage.getItem('client_id');
    const code_verifier = window.localStorage.getItem('code_verifier');
    console.log(code_verifier);
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: client_id,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirect_uri,
        code_verifier: code_verifier,
      }),
    }
  
    const body = await fetch(TOKEN, payload);
    const response = await body.json();
    
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    if (response.access_token === undefined)
        return false;
    return true;
}

export async function getProfile() {
    let accessToken = localStorage.getItem('access_token');
  
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
  
    const data = await response.json();
    return data;
}

export async function getPlaylists () {
    return getProfile().then(async res => {
        const accessToken = localStorage.getItem('access_token');
        const response = await fetch(`https://api.spotify.com/v1/users/${res.display_name}/playlists`, {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        })

        const data = await response.json();
        return data;
    })
}

export async function getArtistId ( query ) {
    const url = 'https://api.spotify.com/v1/search?q=' + query + "&type=artist";
    const accessToken = localStorage.getItem('access_token');

    const response = await fetch (url, {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    })
    
    const data = await response.json();
    return data;
}

export async function getTracks ( artistId ) {
    const url = `https://api.spotify.com/v1/artists/${artistId}/albums`;
    const accessToken = localStorage.getItem('access_token');

    const response = await fetch (url, {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    })

    const data = await response.json();
    return data;
}

export async function createPlaylist (name) {
    return getProfile().then(async res => {
        const accessToken = localStorage.getItem('access_token');
        const params = {
            method: 'POST',
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                name: name,
                description: "New Playlist",
                public: true,
            })
        }
        const response = await fetch(`https://api.spotify.com/v1/users/${res.display_name}/playlists`, params);
        const data = await response.json();
        return data;
    })
}

export async function getAlbum ( href ) {
    const accessToken = localStorage.getItem('access_token');
    const response = await fetch(href, {
        headers: {
            Authorization: "Bearer " + accessToken,
        }
    })

    const data = await response.json();
    return data;
}

export async function getTracks1 ( playlist ) {
    const tracks = [];
    for (let i in playlist) {
        getAlbum(playlist[i].href).then(res => tracks.push(res.tracks.items));
    }

    return tracks;
}

export function getTracksUri ( arr ) {
    let uri = [];

    return uri;
}

export async function saveTracks( playlistId, uriArr ) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const accessToken = localStorage.getItem('access_token');
    const params = {
        method: 'POST',
        headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            uris: uriArr
        })
    }
    const response = await fetch(url, params);
    return response;
} 




  


  