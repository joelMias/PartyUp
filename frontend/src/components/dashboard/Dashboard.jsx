import * as React from 'react';
import './dashboard.css';
import { useLocation } from 'react-router-dom';
import Card from '../user-card/Card';
export default function Dashboard(props) {
    const location = useLocation();

    return (
        <div className="dashboard-container">
            <div className='sidebar'>
               <div id='searchbar-friends'>
                  <img src="./public/img/lupa.png" className="lupa-img" alt="search" />
                  <input type="text" name="cerca" id="cerca-friends" placeholder="Search friends or chats" />
               </div>

               <h2>Online Friends</h2>
               <div className='friends-container'>
                  <div className='contenidor-userFriend'>
                     <Card isHeader={false}/> 
                  </div>
                  <div className='contenidor-userFriend'>
                     <Card isHeader={false}/> 
                  </div>
                  <div className='contenidor-userFriend'>
                     <Card isHeader={false}/> 
                  </div>
                  <div className='contenidor-userFriend'>
                     <Card isHeader={false}/> 
                  </div>
                  <div className='contenidor-userFriend'>
                     <Card isHeader={false}/> 
                  </div>
                  <div className='contenidor-userFriend'>
                     <Card isHeader={false}/> 
                  </div>
                  <div className='contenidor-userFriend'>
                     <Card isHeader={false}/> 
                  </div>
               </div>
               
               <h2>Chats</h2>
            </div>

            <div>
                
            </div>

        </div>
    );
}