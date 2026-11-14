import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Back_button from '../Elements_page/Back_button.jsx';
import NavigaTionButton from '../Elements_page/NavigaTionButton.jsx';
import { loadData, saveData } from '../api';
import '../Styles/Deck.css';
import '../Styles/Plus.css';

export default function Deck() {
    const { id } = useParams();
    const deckId = Number(id);

    const [data, setData] = useState({ items: [], decks: [] });
    const [search, setSearch] = useState('');
    const [listSearch, setListSearch] = useState('');
    const [order, setOrder] = useState([]);
    const [index, setIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [result, setResult] = useState(null);
    const [reversed, setReversed] = useState(() => localStorage.getItem('rev_' + id) === '1');

    const [showForm, setShowForm] = useState(false);
    const [showList, setShowList] = useState(false);
    const [word, setWord] = useState('');
    const [translation, setTranslation] = useState('');
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadData().then(setData).catch(() => {});
    }, []);

    const deck = data.decks.find((d) => d.id === deckId);
    const pos = (item) => {
        const p = order.indexOf(item.id);
        return p === -1 ? 999999 : p;
    };
    const deckItems = data.items.filter((i) => i.deckId === deckId && !i.deleted);
    const words = deckItems
        .filter((i) => i.word.toLowerCase().includes(search.trim().toLowerCase()))
        .sort((a, b) => pos(a) - pos(b));

    const current = words.length ? words[index % words.length] : null;

    async function save(updated, errorText) {
        try {
            await saveData(updated);
            setData(updated);
            return true;
        } catch {
            setMessage(errorText);
            return false;
        }
    }

    function shuffle() {
        const ids = deckItems.map((i) => i.id);
        for (let i = ids.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [ids[i], ids[j]] = [ids[j], ids[i]];
        }
        setOrder(ids);
        setIndex(0);
        setAnswer('');
        setResult(null);
    }

    function toggleDirection() {
    const next = !reversed;
    setReversed(next);
    localStorage.setItem('rev_' + id, next ? '1' : '0');
    setAnswer('');
    setResult(null);
}

function check() {
    if (!current || result) return;
    const expected = reversed ? current.word : current.translation;
    const ok = answer.trim().toLowerCase() === expected.trim().toLowerCase();
    setResult({ ok, correct: expected });
    setTimeout(() => {
        setIndex((i) => i + 1);
        setAnswer('');
        setResult(null);
    }, 1200);
}
    async function handleAddWord() {
        const w = word.trim();
        if (!w || !translation.trim()) {
            setMessage('Введите слово и перевод');
            return;
        }
        const exists = deckItems.some((i) => i.word.toLowerCase() === w.toLowerCase());
        if (exists) {
            setMessage('Такое слово уже есть в этой стопке');
            return;
        }
        const updated = {
            ...data,
            items: [
                ...data.items,
                { id: Date.now(), page: deck?.page, deckId, word: w, translation: translation.trim(), comment },
            ],
        };
        if (await save(updated, 'Не удалось сохранить')) {
            setWord('');
            setTranslation('');
            setComment('');
            setMessage('Слово добавлено!');
        }
    }

    function handleDelete(itemId) {
    const updated = {
        ...data,
        items: data.items.map((i) => (i.id === itemId ? { ...i, deleted: true, deletedAt: Date.now() } : i)),
    };
    save(updated, 'Не удалось удалить');
}

    return (
        <div className="Deck_page">
            <div className="deck_top">
                <input
                    className="deck_search"
                    type="text"
                    placeholder="поиск слова"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="plus" onClick={() => setShowForm(true)}>+</button>
            </div>

            <NavigaTionButton />

            <h1 className="deck_title">
                <button className="deck_title_link" onClick={() => setShowList(true)}>
                    {deck?.name}
                </button>
            </h1>

            <div className="study">
                {current ? (
                    <>
                        <button className="swap_btn" onClick={toggleDirection} title="Поменять язык">⇄</button>
<h2 className="study_word">{reversed ? current.translation : current.word}</h2>
                        <input
                            className="study_input"
                            type="text"
                            placeholder="ваш ответ"
                            value={answer}
                            disabled={!!result}
                            onChange={(e) => setAnswer(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && check()}
                        />
                        <button className="study_btn" onClick={check} disabled={!!result}>ответить</button>
                        {result && (
                            <p className={result.ok ? 'ok' : 'bad'}>
                                {result.ok ? 'Верно!' : `Неверно. Правильно: ${result.correct}`}
                            </p>
                        )}
                        <button className="study_btn" onClick={shuffle}>перемешать</button>
                    </>
                ) : (
                    <p className="notwords">Нажмите «+», чтобы добавить</p>
                )}

                {!showForm && message && <p>{message}</p>}
            </div>

            {showForm && (
                <div className="modal_bg">
                    <div className="modal">
                        <h2>Добавить слово</h2>
                        <input value={word} onChange={(e) => setWord(e.target.value)} placeholder="слово" />
                        <input value={translation} onChange={(e) => setTranslation(e.target.value)} placeholder="перевод" />
                        <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="комментарий" />
                        <button className="study_btn" onClick={handleAddWord}>Добавить</button>
                        <p>{message}</p>
                    </div>
                </div>
            )}

            {showList && (
                <div className="list_page">
                    <div className="list_top">
                        <h2>{deck?.name}: список слов</h2>
                    </div>

                    <input
                        className="list_search"
                        type="text"
                        placeholder="поиск слова"
                        value={listSearch}
                        onChange={(e) => setListSearch(e.target.value)}
                    />

                    <ul className="word_list">
                        {deckItems
                            .filter((i) => i.word.toLowerCase().includes(listSearch.trim().toLowerCase()))
                            .map((item) => (
                                <li key={item.id}>
                                    <span>{item.word} — {item.translation} {item.comment && `(${item.comment})`}</span>
                                    <button className="del_btn" onClick={() => handleDelete(item.id)}>Удалить</button>
                                </li>
                            ))}
                    </ul>
                </div>
            )}

            <Back_button />
        </div>
    );
}