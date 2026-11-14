
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Navigation_button.css';

export default function NavigaTionButton() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const links = [
        { name: 'Главное меню', path: '/' },
        { name: 'Слова', path: '/Words' },
        { name: 'Разговорный', path: '/Speak' },
        { name: 'Правила', path: '/Rules' },
        { name: 'Все данные', path: '/All' },
        { name: 'Корзина', path: '/Trash' },
        { name: 'Настройки', path: '/Settings' },
    ];

    function go(path) {
        setOpen(false);
        navigate(path);
    }

    return (
        <div className="Page_Navigation">
            <button className="Nav_Page" onClick={() => setOpen(true)}>☰</button>

            <div
                className={open ? 'overlay show' : 'overlay'}
                onClick={() => setOpen(false)}
            />

            <nav className={open ? 'side_panel open' : 'side_panel'}>
                <button className="close_panel" onClick={() => setOpen(false)}>✕</button>

                {links.map((l) => (
                    <button
                        key={l.path}
                        className="side_link"
                        onClick={() => go(l.path)}
                    >
                        {l.name}
                    </button>
                ))}
            </nav>
        </div>
    );
}
