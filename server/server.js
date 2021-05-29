const express = require("express");
const spotifyWebApi = require("spotify-web-api-node");

const app = express();

app.post("/login", (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUrl: "http://localhost:3000",
        clientId: "0c9eb454ffc2431cabd8ddc114204945",
        clientSecret: "82ff62c1e12949dcb8f01a9ae99a99dc"
    });

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch(() => {
        res.sendStatus(400);
    });
});