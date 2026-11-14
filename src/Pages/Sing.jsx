import { API } from '../api.js';
import '../Styles/Sing.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Back_button.css';

export default function Sing() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        try {
            const res = await fetch(API + '/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.error);
                return;
            }
            localStorage.setItem('token', data.token);
            navigate('/');
        } catch (error) {
            console.error(error);
            setMessage('Сервер недоступен');
        }
    };

    return (
        <div className="Sing_page">
            <h1 className='data'>введите данные</h1>
            <div className='input'>
                <input type="text" placeholder="ник" value={username}
                    onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="пароль" value={password}
                    onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='SingAccount'>
                <button onClick={handleLogin}>войти</button>
                {message && <p>{message}</p>}
            </div>
            <div className='reg'>
                <h2>если у вас нет аккаунта, нажмите на
                    <button className='reg2' onClick={() => navigate('/Reg')}>зарегистрироваться</button>
                </h2>
            </div>
            <button className="last_page" onClick={() => navigate(-1)}>back</button>
        </div>
    );
}