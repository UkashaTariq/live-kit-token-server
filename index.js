const express = require('express');
const { AccessToken } = require('livekit-server-sdk');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Route to generate token
app.post('/generate-token', async (req, res) => {
    const { roomName, uid } = req.body;

    if (!roomName || !uid) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    // Create an access token
    const unsecureToken = new AccessToken(apiKey, apiSecret, {
        identity: uid, // Unique identifier for the user
    });

    // Assign claims to the token (e.g., permissions, room details)
    unsecureToken.addGrant({
        roomJoin: true,       // Allow the user to join rooms
        room: roomName, // Room the token is valid for
    });

    const token = await unsecureToken.toJwt();

    return res.json({ token });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
