require("dotenv").config();  
const express = require("express");
const cors = require("cors"); //This is for that Cors policy thing 
const bodyParser = require("body-parser");
const lyricsFinder = require("lyrics-finder");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// Evoked when expiresIn is 0 and we need a new access token
// Uses the refresh token to get a new access token 
app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken
    });

    spotifyApi.refreshAccessToken().then(
        (data) => {
          res.json({
              accessToken: data.accessToken,
              expiresIn: data.expiresIn,
          });
          spotifyApi.setAccessToken(data.body['access_token']);
        }).catch(() => res.sendStatus(400));
})


// Evoked when first logged in to get access token from auth code
app.post("/login", (req, res) => {
    const code = req.body.code; // The authentication code passed from the front
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    });

    //This uses the code to give an access token
    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({ //Sends the json object back to the front with all the info
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch((err) => {
        console.log(err);
        res.sendStatus(400);
    });
});

//This is for getting the lyrics of the scoping
//The get request receives both the artist and the title of the song
app.get("/lyrics", async(req, res) => {
    //Uses async function to get lyrics from lyrics finder
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No lyrics found";
    res.json({lyrics});
});

app.listen(3001); 