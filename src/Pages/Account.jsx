import { useNavigate, Navigate } from 'react-router-dom';
import '../Styles/Back_button.css';
import { useState } from 'react';
import '../Styles/Account.css';
import accountImg from '../assets/account.jpg';

export default function Account() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    if (!token) return <Navigate to="/Sing" />;

    const username = JSON.parse(atob(token.split('.')[1])).username;

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="Account_page">
            <div className='Aimg'>
            <img  className='imgaccount'src={accountImg} alt="" />
            <h1 className='Nameaccount'>Аккаунт</h1>
            </div>
            <button className="outt" onClick={logout}>выйти</button>
            <h2 className='Hellow'>Здравствуйте, {username}!  </h2> 
            <div></div>
            <button className="last_page" onClick={() => navigate('/')}>back</button>
        </div>
    );
}
