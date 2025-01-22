// The redirect_uri for the spotify api
const redirect_uri = 'https://spotify-create-playlists.netlify.app';

// Important api endpoints
const AUTHORIZE = 'https://accounts.spotify.com/authorize';
const TOKEN = "https://accounts.spotify.com/api/token";

// Scope for api request
const scope = "user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private playlist-modify-public playlist-modify-private";
// Generating the authorize url
const authUrl = new URL(AUTHORIZE);

// Function for generating a random string
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// Function for hashing the passed string
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

// Generating the code verifier for authorization with pkce
const codeVerifier = generateRandomString(64);
// Hashing the code verifier
const hashed = await sha256(codeVerifier);
// Generating the codeChallenge by encoding the hashed code verifier
const codeChallenge = base64urlencode(hashed);

// Function for redirecting to the spotify authorization page and requesting user authorization
export function requestAuthorization(client_id) {
    // Stores the code verifier and codeChallenge in the browser's local storage
    window.localStorage.setItem('code_verifier', codeVerifier);
    window.localStorage.setItem('code_challenge', codeChallenge);
    // params for the url request/redirection
    const params = {
        response_type: 'code',
        client_id: client_id,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirect_uri,
}
    // Setting the params of the already generated url
    authUrl.search = new URLSearchParams(params).toString();
    // Changing the window url to redirect the user
    window.location.href = authUrl.toString();
}

// Function for retrieving the code from the url
function accessCode () {
    // Creating an object of url parameters
    const urlParams = new URLSearchParams(window.location.search);
    // Retrieving the value of the code parameter
    let code = urlParams.get('code');
    // Returning the code parameter
    return code;
}

// Function for requesting token from spotify
export const getToken = async () => {
    // Retrieving the code from the url
    let code = accessCode();
    // Retrieving client_id and code_verifier from the browser's local storage
    const client_id = window.localStorage.getItem('client_id');
    const code_verifier = window.localStorage.getItem('code_verifier');
    // Setting the params for the http/https POST request
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
    
    // Requesting data(access_token) from the spotify server
    const body = await fetch(TOKEN, payload);
    // Converting the response to json format
    const response = await body.json();
    
    // Storing the access_token and refresh_token in the local storage
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);

    // Returning the status of the request based on the value of the access_token
    if (response.access_token === undefined)
        return false;
    return true;
}

// Function for retrieving the user's profile
export async function getProfile() {
    // Accessing the token
    let accessToken = localStorage.getItem('access_token');
    // Requesting user information
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    // Converting the response to json format and returning it
    const data = await response.json();
    return data;
}

/*
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
*/

// Function for requesting the artist id
export async function getArtistId ( query ) {
    // Url endpoint for the api
    const url = 'https://api.spotify.com/v1/search?q=' + query + "&type=artist";
    // accessing the Token
    const accessToken = localStorage.getItem('access_token');
   
    // Requesting the data from the spotify's api
    const response = await fetch (url, {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    })

    // Converting the data to json format and returning it
    const data = await response.json();
    return data;
}

// Function for getting the albums for the artist whose id is passed
export async function getAlbums ( artistId ) {
    // api endpoint 
    const url = `https://api.spotify.com/v1/artists/${artistId}/albums`;
    // Accessing the token
    const accessToken = localStorage.getItem('access_token');
    
    // Requesting the albums for the artist
    const response = await fetch (url, {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    })
    
    // Converting it to json format and returning it
    const data = await response.json();
    return data;
}

// Function for creating a new playlist with the passed name in the user's spotify account
export async function createPlaylist (name) {
    // Uses the getProfile function to access information about the user
    return getProfile().then(async res => {
        // Accessing the token
        const accessToken = localStorage.getItem('access_token');
        // Setting the params for POST request
        const params = {
            method: 'POST',
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": 'application/json'
            },
            // Information about the playlist that is stringified
            body: JSON.stringify({
                name: name,
                description: "New Playlist",
                public: true,
            })
        }
        // Sending the requesting at the user_name/playlists endpoint and awaiting the response 
        const response = await fetch(`https://api.spotify.com/v1/users/${res.display_name}/playlists`, params);
        // The response is converted to json format and returned
        const data = await response.json();
        return data;
    })
}

// Function that takes an url as its argument and returns the album that the url specifies
export async function getAlbum ( url ) {
    // Accessing the token
    const accessToken = localStorage.getItem('access_token');
    // Requesting the album and storing it in the response var
    const response = await fetch(url, {
        headers: {
            Authorization: "Bearer " + accessToken,
        }
    })
    // Converting the response to json format and returing it
    const data = await response.json();
    return data;
}

// Function that takes an array of albums and returns an array of tracks that are in those albums
export async function getTracksArray ( arrOfAlbums ) {
    const tracks = [];
    // Iterating over the array and requesting the album from spotify for each album in the array and storing its tracks in the track array
    for (let i in arrOfAlbums) {
        getAlbum(arrOfAlbums[i].href).then(res => tracks.push(res.tracks.items));
    }
    // returning the tracks array
    return tracks;
}

// Function for saving the tracks in the new created playlist
// It takes the id of the newly created playlist and an array of track_uri of all the tracks that are to be added
export async function saveTracks( playlistId, uriArr ) {
    // The url to which the request is to be sent
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    // Accessing the accessToken
    const accessToken = localStorage.getItem('access_token');
    // Setting the params for the request
    const params = {
        method: 'POST',
        headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": 'application/json'
        },
        // The body must be stringified according to the spotify's api documentation
        body: JSON.stringify({
            uris: uriArr
        })
    }
    // Sending the request and storing the response in the response var which is then returned
    const response = await fetch(url, params);
    return response;
} 




  


  