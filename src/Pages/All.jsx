import { useState, useEffect } from 'react';
import '../Styles/All.css';
import Back_button from '../Elements_page/Back_button.jsx';
import { loadData, saveData } from '../api';

const TABS = [
    { value: 'all', name: 'Все' },
    { value: 'Words', name: 'Слова' },
    { value: 'Speak', name: 'Разговорный' },
    { value: 'Rules', name: 'Правила' },
];

export default function All() {
    const [data, setData] = useState({ items: [], decks: [] });
    const [tab, setTab] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadData().then(setData).catch(() => {});
    }, []);

    const items = data.items
        .filter((i) => !i.deleted)
        .filter((i) => tab === 'all' || i.page === tab)
        .filter((i) => i.word.toLowerCase().includes(search.trim().toLowerCase()));

    const pageName = (p) => TABS.find((t) => t.value === p)?.name || p;

    async function handleDelete(id) {
        const next = {
            ...data,
            items: data.items.map((i) => (i.id === id ? { ...i, deleted: true, deletedAt: Date.now() } : i)),
        };
        await saveData(next);
        setData(next);
    }

    return (
        <div className="All">
            <div className="all_top">
                <h1>Все данные</h1>

                <div className="all_tabs">
                    {TABS.map((t) => (
                        <button
                            key={t.value}
                            className={tab === t.value ? 'all_tab active' : 'all_tab'}
                            onClick={() => setTab(t.value)}
                        >
                            {t.name}
                        </button>
                    ))}
                </div>

                <input
                    className="all_search"
                    placeholder="поиск"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="all_middle">
                {items.length === 0 && <p>Ничего нет</p>}

                <ul className="all_list">
                    {items.map((i) => (
                        <li key={i.id}>
                            <span>
                                {i.word} — {i.translation} {i.comment && `(${i.comment})`}
                                <small> · {pageName(i.page)}</small>
                            </span>
                            <button onClick={() => handleDelete(i.id)}>Удалить</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="all_bottom">
                <Back_button />
            </div>
        </div>
    );
}