
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Menu from './Pages/Menu.jsx';
import Sing from './Pages/Sing.jsx';
import Rules from './Pages/Rules.jsx';
import Speak from './Pages/Speak.jsx';
import Words from './Pages/Words.jsx';
import Add from './Pages/Add.jsx';
import Reg from './Pages/Reg.jsx';
import Account from './Pages/Account.jsx';
import Deck from './Pages/Deck.jsx';
import Trash from './Pages/Trash.jsx';
import All from './Pages/All.jsx';

import LastPage from './Elements_page/LastPage.jsx';

function App() {
    const isLoggedIn = !!localStorage.getItem('token');

    return (
        <BrowserRouter>
            <LastPage />

            <Routes>
                <Route path="/" element={<Menu />} />
                <Route path="/Sing" element={isLoggedIn ? <Navigate to="/Account" /> : <Sing />} />
                <Route path="/Reg" element={isLoggedIn ? <Navigate to="/Account" /> : <Reg />} />
                <Route path="/Account" element={<Account />} />
                <Route path="/Rules" element={<Rules />} />
                <Route path="/Speak" element={<Speak />} />
                <Route path="/Add" element={<Add />} />
                <Route path="/Words" element={<Words />} />
                <Route path="/Deck/:id" element={<Deck />} />
                <Route path="/Trash" element={<Trash />} />
                <Route path="/All" element={<All />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
