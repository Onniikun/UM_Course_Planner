import "./contact.css"
import React from 'react';

export function Contact() {
    return (
        <div>
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
            <h1>Contact</h1>
        </div>
    );
}