import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const jwt = jsonwebtoken;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SECRET = process.env.SECRET || 'смените-на-длинную-случайную-строку';
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Не задана переменная MONGODB_URI');
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);
await client.connect();
const users = client.db('enl').collection('users');
await users.createIndex({ username: 1 }, { unique: true });
console.log('База подключена');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const NAME_RE = /^[a-zA-Z0-9_-]+$/;
const norm = (u) => String(u || '').trim().toLowerCase();

app.post('/register', async (req, res) => {
  try {
    const username = norm(req.body.username);
    const password = String(req.body.password || '');
    if (!username || !password) return res.status(400).json({ error: 'Заполните поля' });
    if (!NAME_RE.test(username)) return res.status(400).json({ error: 'Ник: латиница, цифры, _ и -' });
    if (await users.findOne({ username })) return res.status(409).json({ error: 'Имя занято' });

    const passwordHash = await bcrypt.hash(password, 10);
    await users.insertOne({ username, passwordHash, items: [], decks: [] });
    res.json({ token: jwt.sign({ username }, SECRET, { expiresIn: '365d' }) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const username = norm(req.body.username);
    const password = String(req.body.password || '');
    const user = await users.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
      return res.status(401).json({ error: 'Неверные данные' });
    res.json({ token: jwt.sign({ username }, SECRET, { expiresIn: '365d' }) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

const auth = (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    req.user = jwt.verify(token, SECRET).username;
    next();
  } catch {
    res.status(401).json({ error: 'Нужен вход' });
  }
};

app.get('/data', auth, async (req, res) => {
  try {
    const user = await users.findOne({ username: req.user });
    if (!user) return res.status(401).json({ error: 'Нужен вход' });
    res.json({ items: user.items || [], decks: user.decks || [] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/data', auth, async (req, res) => {
  try {
    const { items, decks } = req.body;
    if (!Array.isArray(items) || !Array.isArray(decks))
      return res.status(400).json({ error: 'Неверные данные' });
    const r = await users.updateOne({ username: req.user }, { $set: { items, decks } });
    if (!r.matchedCount) return res.status(401).json({ error: 'Нужен вход' });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.use(express.static(path.join(__dirname, '../dist')));
app.use((req, res) => res.sendFile(path.join(__dirname, '../dist/index.html')));

app.listen(process.env.PORT || 3001, '0.0.0.0', () => console.log('Сервер запущен'));