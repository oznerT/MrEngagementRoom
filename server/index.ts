const express = require('express');
const path = require('path');
const cors = require('cors');
const router = express.Router();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const compression = require('compression');

const app = express();
const port = 8080;

app.use(cors());
app.use(compression());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Handle GET requests to /api route
app.post('/api/send-email', (req, res) => {
    const { name, company, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.FOLIO_EMAIL,
            pass: process.env.FOLIO_PASSWORD,
        },
    });

    transporter
        .verify()
        .then(() => {
            transporter
                .sendMail({
                    from: `"${name}" <henryheffernan.folio@gmail.com>`, // sender address
                    to: 'henryheffernan@gmail.com, henryheffernan.folio@gmail.com', // list of receivers
                    subject: `${name} <${email}> ${company ? `from ${company}` : ''
                        } submitted a contact form`, // Subject line
                    text: `${message}`, // plain text body
                })
                .then((info) => {
                    console.log({ info });
                    res.json({ message: 'success' });
                })
                .catch((e) => {
                    console.error(e);
                    res.status(500).send(e);
                });
        })
        .catch((e) => {
            console.error(e);
            res.status(500).send(e);
        });
});

// --- LOCAL DEV MOCKS (Collective T-Shirt) ---

// In-memory store for local dev
const localTiles: any[] = [];
const localStrokes: any[] = [];

// Initialize grid 5x5 for dev
if (localTiles.length === 0) {
    const GRID = 5;
    for (let _x = 0; _x < GRID; _x++) {
        for (let _y = 0; _y < GRID; _y++) {
            localTiles.push({
                id: `${_x}-${_y}`,
                x: _x / GRID, y: _y / GRID,
                w: 1 / GRID, h: 1 / GRID,
                used: 0
            });
        }
    }
}

app.get('/api/claimTile', (req, res) => {
    // Find first unused tile or random one
    const available = localTiles.filter(t => t.used === 0);
    let tile;
    if (available.length > 0) {
        tile = available[Math.floor(Math.random() * available.length)];
    } else {
        // Reuse random if all full
        tile = localTiles[Math.floor(Math.random() * localTiles.length)];
    }

    // Simulate latency
    setTimeout(() => {
        res.json(tile);
    }, 300);
});

app.get('/api/strokes', (req, res) => {
    // Return all strokes for background
    res.json(localStrokes.slice(-500));
});

app.post('/api/submitTile', (req, res) => {
    console.log('--- SUBMIT TILE RECEIVED ---');
    const { tileId, strokes } = req.body;

    if (!tileId || !strokes || !Array.isArray(strokes)) {
        return res.status(400).json({ error: "Invalid data" });
    }

    // Mark tile used locally
    const t = localTiles.find(lt => lt.id === tileId);
    if (t) t.used = 1;

    // Save strokes
    localStrokes.push({
        id: 'stroke-' + Date.now(),
        tileId,
        strokes_json: strokes,
        created_at: Date.now()
    });

    console.log(`Tile ${tileId} filled. Total strokes stored: ${localStrokes.length}`);

    setTimeout(() => {
        res.json({ ok: true });
    }, 800);
});

// listen to app on port 8080
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
