import * as React from 'react';
import './card.css';

export default function Card({ isHeader, userData, setOpenMenu}) {
    return (
        <div className='user-container'>
            <div 
                className='user-avatar' 
                style={{ backgroundImage: `url(${userData?.avatar || "/default-avatar.png"})` }} 
            >
                <div
                    className='state' 
                    style={{ 
                        backgroundColor: 
                        userData?.state === "connected" ? "green" : 
                        userData?.state === "absent" ? "orange" : 
                        "gray" 
                    }}
                />
                
            </div>

            <div className='user-name'>
                <p className='headerCard-userName text-card'>
                    {userData?.username || "Guest"} {/*Si es troba usuari logged*/}
                    { isHeader && <img  className="dropdown-img" src="/img/drop-down.png" onClick={() => setOpenMenu(prev => !prev)}/>} {/*Si es el header del dashboard*/}          
                </p>

                <p className='text-card'>{userData?.description || "No description"}</p>
            </div>
        </div>
    );

}