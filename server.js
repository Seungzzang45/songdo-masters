const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// For Railway deployment
const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || '.';
const VOTE_DATA_FILE = path.join(DATA_DIR, 'vote_data.json');
const SEED_FILE = path.join(__dirname, 'vote_data.json');

// Seed the volume on first startup so existing data survives the move to persistent storage
if (DATA_DIR !== '.' && !fs.existsSync(VOTE_DATA_FILE) && fs.existsSync(SEED_FILE)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.copyFileSync(SEED_FILE, VOTE_DATA_FILE);
    console.log(`Seeded ${VOTE_DATA_FILE} from ${SEED_FILE}`);
  } catch (e) {
    console.error('Volume seed failed:', e);
  }
}

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

app.get('/api/vote/load', (req, res) => {
  try {
    if (fs.existsSync(VOTE_DATA_FILE)) {
      res.send(fs.readFileSync(VOTE_DATA_FILE, 'utf8'));
    } else {
      res.send('{"polls":[]}');
    }
  } catch (e) {
    res.send('{"polls":[]}');
  }
});

app.post('/api/vote/save', (req, res) => {
  try {
    fs.writeFileSync(VOTE_DATA_FILE, JSON.stringify(req.body));
    res.send('success');
  } catch (e) {
    res.status(500).send('error');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`투표 서버 실행 중: http://0.0.0.0:${PORT}`);
});
