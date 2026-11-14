import { useNavigate } from 'react-router-dom';
import "../Styles/Back_button.css"

function Back_button() {
    const navigate = useNavigate();
    return (
        <button className="last_page" onClick={() => navigate(-1)}>back</button>
    );
}

export default Back_button