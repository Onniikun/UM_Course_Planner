import { useNavigate  } from 'react-router-dom';

export function Home() {
    const navigate = useNavigate();
    return(
        <>
        <div>
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