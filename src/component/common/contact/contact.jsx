import "./contact.css"
import React from 'react';
import logo from '../../../apis/logo-2.png';

export function Contact() {
    return (
        <div>
            <img className="logo" src={logo} alt="University of Manitoba Logo" />
            <div className="contact-card">
                <h2 className="contact-title">
                    Contact Us.
                </h2>
                    <p className="contact-text">
                    Having trouble choosing the right course or need assistance with your
                    registration? Our admissions team is here to help you.
                    </p>
                <a className='help'
                    href="https://umanitoba.ca/explore/contact-admissions-and-recruitment"
                    target="_blank"
                    rel="noopener noreferrer">
                    Need Help?
                </a>
                </div>
            </div>
    );
}