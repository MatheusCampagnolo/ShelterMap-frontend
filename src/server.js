require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { title: 'ShelterMap' });
});

app.get('/profile', (req, res) => {
  res.send('Profile page');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});