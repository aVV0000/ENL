import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../Styles/Add.css';
import Back_button from '../elements_page/Back_button';
import { loadData, saveData } from '../api';

export default function Add() {
    const { state } = useLocation();
    const page = state?.page;

    const [deckName, setDeckName] = useState('');
    const [message, setMessage] = useState('');
    const [data, setData] = useState({ items: [], decks: [] });

    useEffect(() => {
        loadData().then(setData).catch(() => setMessage('Войдите в аккаунт'));
    }, []);

    if (!page) {
        return (
            <div className='Add'>
                <p>Нажмите «+»</p>
                <Back_button />
            </div>
        );
    }

    const pageDecks = data.decks.filter((d) => d.page === page);

    async function handleCreateDeck() {
        const name = deckName.trim();
        if (!name) {
            setMessage('Введите название стопки');
            return;
        }
        if (pageDecks.some((d) => d.name.toLowerCase() === name.toLowerCase())) {
            setMessage('Такая стопка уже есть');
            return;
        }
        const newDeck = { id: Date.now(), page, name };
        const updated = { ...data, decks: [...data.decks, newDeck] };
        await saveData(updated);
        setData(updated);
        setDeckName('');
        setMessage('Стопка создана!');
    }

    return (
        <div className='Add'>
            <h1 className='add_text'>Новая стопка ({page})</h1>
            <div className='input_save'>
                <input value={deckName} onChange={(e) => setDeckName(e.target.value)} placeholder='название стопки' />
                <button className="save" onClick={handleCreateDeck}>Создать стопку</button>
            </div>
            <p>{message}</p>
            <Back_button />
        </div>
    );
}