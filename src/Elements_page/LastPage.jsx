
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function LastPage() {
    const location = useLocation();

    useEffect(() => {
        const allowedPages = ['/Words', '/Rules', '/Speak'];

        if (allowedPages.includes(location.pathname)) {
            localStorage.setItem('lastLearningPage', location.pathname);
        }
    }, [location.pathname]);

    return null;
}