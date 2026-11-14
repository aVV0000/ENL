import { useState, useEffect } from 'react';
import '../Styles/Trash.css';
import Back_button from '../Elements_page/Back_button.jsx';
import { loadData, saveData } from '../api';

export default function Trash() {
    const [data, setData] = useState({ items: [], decks: [] });
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadData().then(setData).catch(() => {});
    }, []);

    const q = search.trim().toLowerCase();
    const deleted = data.items
        .filter((i) => i.deleted)
        .filter((i) => i.word.toLowerCase().includes(q) || i.translation.toLowerCase().includes(q))
        .sort((a, b) => (b.deletedAt || 0) - (a.deletedAt || 0));

    async function update(items) {
        const next = { ...data, items };
        await saveData(next);
        setData(next);
    }

    const restore = (id) =>
        update(data.items.map((i) => (i.id === id ? { ...i, deleted: false, deletedAt: undefined } : i)));

    const removeForever = (id) =>
        update(data.items.filter((i) => i.id !== id));

    const clearAll = () =>
        update(data.items.filter((i) => !i.deleted));

    return (
        <div className="Trash">
            <div className="trash_top">
                <h1>Корзина</h1>
                <input
                    className="trash_search"
                    type="text"
                    placeholder="поиск в корзине"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {data.items.some((i) => i.deleted) && (
                    <button className="trash_clear" onClick={clearAll}>Очистить корзину</button>
                )}
            </div>

            <div className="trash_middle">
                {deleted.length === 0 && <p>{search ? 'Ничего не найдено' : 'Корзина пуста'}</p>}

                <ul className="trash_list">
                    {deleted.map((i) => (
                        <li key={i.id}>
                            <span>{i.word} — {i.translation}</span>
                            <div className="trash_btns">
                                <button onClick={() => restore(i.id)}>Вернуть</button>
                                <button onClick={() => removeForever(i.id)}>Удалить навсегда</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="trash_bottom">
                <Back_button />
            </div>
        </div>
    );
}