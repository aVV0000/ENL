import express from 'express';
import cors from 'cors';
import fs from 'fs';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const jwt = jsonwebtoken;
const SECRET = process.env.SECRET || 'смените-на-длинную-случайную-строку';
const DIR = process.env.DATA_DIR || './server/data/users';
fs.mkdirSync(DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json());

const file = (u) => `${DIR}/${u.replace(/[^a-zA-Z0-9_-]/g, '')}.json`;

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Заполните поля' });
  if (fs.existsSync(file(username))) return res.status(409).json({ error: 'Имя занято' });
  const passwordHash = await bcrypt.hash(password, 10);
  fs.writeFileSync(file(username), JSON.stringify({ passwordHash, items: [], decks: [] }, null, 2));
  res.json({ token: jwt.sign({ username }, SECRET) });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!fs.existsSync(file(username))) return res.status(401).json({ error: 'Неверные данные' });
  const data = JSON.parse(fs.readFileSync(file(username), 'utf8'));
  if (!(await bcrypt.compare(password, data.passwordHash)))
    return res.status(401).json({ error: 'Неверные данные' });
  res.json({ token: jwt.sign({ username }, SECRET) });
});

const auth = (req, res, next) => {
  try {
    req.user = jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), SECRET).username;
    next();
  } catch {
    res.status(401).json({ error: 'Нужен вход' });
  }
};

app.get('/data', auth, (req, res) => {
  const { items, decks } = JSON.parse(fs.readFileSync(file(req.user), 'utf8'));
  res.json({ items, decks });
});

app.put('/data', auth, (req, res) => {
  const data = JSON.parse(fs.readFileSync(file(req.user), 'utf8'));
  data.items = req.body.items;
  data.decks = req.body.decks;
  fs.writeFileSync(file(req.user), JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

app.use(express.static(path.join(__dirname, '../dist')));
app.use((req, res) => res.sendFile(path.join(__dirname, '../dist/index.html')));

app.listen(process.env.PORT || 3001, '0.0.0.0', () => console.log('Сервер запущен'));