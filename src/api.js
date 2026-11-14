export const API = import.meta.env.DEV ? `http://${window.location.hostname}:3001` : '';

const headers = () => ({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token'),
});

export async function loadData() {
    const res = await fetch(API + '/data', { headers: headers() });
    if (!res.ok) throw new Error('Нужен вход');
    return res.json(); // { items, decks }
}

export async function saveData(data) {
    const res = await fetch(API + '/data', {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Не удалось сохранить');
}