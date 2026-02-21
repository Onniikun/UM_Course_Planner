import { NavLink } from "react-router-dom";
import './navbar.css';


export function Navbar() {
    return (
        <>
        <div className="navbar">
        <div className="nav-links">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/Registration">Registration</NavLink>
                <NavLink to="/Contact">Contact</NavLink>
        </div>
        </div>
        </>
    );
}
