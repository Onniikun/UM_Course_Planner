import React from 'react';
import './footer.css';

export function Footer() {
    return (
        <footer className="footer">  
            <p>Copyright © {new Date().getFullYear()} The Dream Team All rights reserved.</p>
        </footer>
    );
}