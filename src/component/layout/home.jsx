import { useNavigate  } from 'react-router-dom';
import './home.css';
import logo from '../../apis/logo-2.png';

export function Home() {
    const navigate = useNavigate();
    return(
        <>
        <div>
            <img className="logo" src={logo} alt="University of Manitoba Logo" />
            <h1>Welcome to UofM Registration</h1>
            <button className="home-button"
            onClick={() =>
                navigate("Registration")}
            >
                Begin Your Future Here Today!
            </button>
        </div>
        </>
    )
}