const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

let leaderboard = [];

app.get('/api/leaderboard', (req, res) => {
  res.json(leaderboard.slice(0, 100));
});

app.post('/api/leaderboard', (req, res) => {
  const { playerName, planetLevel, totalDamage, planetsDestroyed } = req.body;
  
  if (!playerName || !planetLevel) {
    return res.status(400).json({ error: 'Missing data' });
  }

  const existingIndex = leaderboard.findIndex(p => p.playerName === playerName);
  
  if (existingIndex >= 0) {
    if (planetLevel > leaderboard[existingIndex].planetLevel) {
      leaderboard[existingIndex] = { playerName, planetLevel, totalDamage, planetsDestroyed };
    }
  } else {
    leaderboard.push({ playerName, planetLevel, totalDamage, planetsDestroyed });
  }
  
  leaderboard.sort((a, b) => b.planetLevel - a.planetLevel);
  
  const rank = leaderboard.findIndex(p => p.playerName === playerName) + 1;
  
  res.json({ rank });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
