
import { useNavigate } from 'react-router-dom';
import '../Styles/Menu.css';
import '../index.css';
import NavigaTionButton from '../Elements_page/NavigaTionButton.jsx';

function Menu() {
    const navigate = useNavigate();

    function startLearning() {
        const lastPage = localStorage.getItem('lastLearningPage') || '/Words';
        navigate(lastPage);
    }

    return (
        <div className="main_menu">
            <NavigaTionButton />

            <button
                className="Sing"
                onClick={() => navigate(localStorage.getItem('token') ? '/Account' : '/Sing')}
            >
                sing up
            </button>

            <div className="achievements">
                <h1>Your achievements</h1>
            </div>

            <div className="line"></div>

            <div className="achievements_text">
                <p>
                    You know <span className="new_words_time">300</span> more words than you did a month ago
                </p>

                <br />

                <p>
                    A total of <span className="new_words_time_all">400</span> new words have been learned
                </p>

                <br />

                <div className="goal">
                    <h2>
                        your daily word count goal <span className="day">(12/20)</span>
                    </h2>

                    <p>
                        You’ve kept the streak going for <span className="fire">32</span> days now
                    </p>

                    <div className="learn">
                        <button className="start_learning" onClick={startLearning}>
                            start learning
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Menu;
