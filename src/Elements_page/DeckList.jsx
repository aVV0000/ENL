import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadData } from '../api';
import Back_button from './Back_button.jsx';
import '../Styles/DeckList.css';
import '../Styles/Plus.css';
import NavigaTionButton from '../Elements_page/NavigaTionButton.jsx';
import '../Styles/PageTop.css';

export default function DeckList({ page }) {
    const [data, setData] = useState({ items: [], decks: [] });
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadData().then(setData).catch(() => {});
    }, []);

    const decks = data.decks
        .filter((d) => d.page === page)
        .filter((d) => d.name.toLowerCase().includes(search.trim().toLowerCase()));

    return (
        <div className="deck_page"> 
            <div className="page_top">
                <input
                    className="deck_search"
                    type="text"
                    placeholder="поиск стопки"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="plus" onClick={() => navigate('/Add', { state: { page } })}>+</button>
            </div>
                        <NavigaTionButton />

            <div className="dl_middle">
                <div className="deck_list">
                    {decks.map((d) => (
                        <button key={d.id} className="deck" onClick={() => navigate(`/Deck/${d.id}`)}>
                            <span className="deck_name">{d.name}</span>
                            <span className="deck_count">
                                {data.items.filter((i) => i.deckId === d.id && !i.deleted).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="dl_bottom">
                <Back_button />
            </div>
        </div>
    );
}