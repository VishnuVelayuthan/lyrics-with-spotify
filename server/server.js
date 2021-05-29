const express = require("express");
const cors = require("cors"); //This is for that Cors policy thing 
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Evoked when expiresIn is 0 and we need a new access token
// Uses the refresh token to get a new access token 
app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: "http://localhost:3000",
        clientId: "0c9eb454ffc2431cabd8ddc114204945",
        clientSecret: "82ff62c1e12949dcb8f01a9ae99a99dc",
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
        redirectUri: "http://localhost:3000",
        clientId: "0c9eb454ffc2431cabd8ddc114204945",
        clientSecret: "82ff62c1e12949dcb8f01a9ae99a99dc"
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

app.listen(3001); 