import { NavLink } from "react-router-dom";
import React from 'react';
import './navbar.css';

export function Navbar() {
    return (
        <>
        <div className="navbar">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/Registration">Registration</NavLink>
                <NavLink to="/Contact">Contact</NavLink>
        </div>
        </>
    );
}
