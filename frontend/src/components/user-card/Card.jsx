import * as React from 'react';
import './card.css';

export default function Card({ isHeader }) {
    return (
        <div className='user-container'>
            <div className='user-avatar' />
            <div className='user-name'>
                <p className='headerCard-userName text-card'>Joel Mias { isHeader && <img  className="dropdown-img" src="/img/drop-down.png"/>}</p>
                <p className='text-card'>Steam connected</p>
            </div>
        </div>
    );

}