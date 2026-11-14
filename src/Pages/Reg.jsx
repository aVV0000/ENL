import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Styles/Reg.css";
import Back_button from '../Elements_page/Back_button.jsx';
import { API } from '../api';

export default function Reg() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    async function register() {
        const name = username.trim();

        if (!name || !password) {
            setMessage('Заполните ник и пароль');
            return;
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
            setMessage('Ник: только латиница, цифры, _ и -');
            return;
        }
        if (password !== password2) {
            setMessage('Пароли не совпадают');
            return;
        }
        try {
            const res = await fetch(API + '/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: name, password }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                navigate('/Account');
            } else {
                setMessage(data.error || 'Не удалось создать аккаунт');
            }
        } catch {
            setMessage('Сервер недоступен');
        }
    }

    return (
        <div className="regPage">
            <h2 className="reg3">Регистрация</h2>
            <div className="InputReg">
                <input type="text" placeholder="NickName" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="email" placeholder="Почта" value={email} onChange={(e) => setEmail(e.target.value)} />

                <div className="passwordField">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Придумайте пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" className="eye" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? '🙈' : '👁'}
                    </button>
                </div>

                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Повторите пароль"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                />
            </div>
            <button className="create" onClick={register}>Создать аккаунт</button>
            <p>{message}</p>
            <Back_button />
        </div>
    );
}