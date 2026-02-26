import * as React from 'react';
import './dashboard.css';
import { useLocation } from 'react-router-dom';
import Card from '../user-card/Card';
export default function Dashboard(props) {
   const location = useLocation();
   const [matches, setMatches] = React.useState([]);

   const refreshDashboard = async () => {
      //Aquest array, guardara 3 promeses una per cada fetch (peticio) al servidor i esperarem a que totes estiguin resoltes
      const [matchesRes, notificationsRes, gamesRes] = await Promise.all([
         fetch("/api/getMatches.php"),
         /*fetch("/api/getNotifications.php"),
         fetch("/api/getUserGames.php")*/
      ]);

      setMatches(await matchesRes.json()); //convertim la promesa a objecte js
      /*setNotifications(await notificationsRes.json()); //convertim la promesa a objecte js
      setUserGames(await gamesRes.json()); //convertim la promesa a objecte js*/
   };

   React.useEffect(() => {
      refreshDashboard();
   }, []);

   return (
      <div className="dashboard-container">
         <div className='sidebar'>
            <div id='searchbar-friends'>
               <img src="./public/img/lupa.png" className="lupa-img" alt="search" />
               <input type="text" name="cerca" id="cerca-friends" placeholder="Search friends or chats" />
            </div>

            <h2>Friends</h2>
            <div className='friends-container'>
               {
                  matches.map((match) => (
                     <Card 
                        key={match.id}
                        userData={match}
                     />
                  ))
               }
            </div>

            <h2>Chats</h2>
         </div>

         <div className='mainContainer'>
               <div className='matchContainer'>
                  <div className='matchCard'>
                     <div className='avatarContainer'>
                        <img />
                     </div>
                     <div className='infoContainer'>
                        <h1>User Name</h1>
                        <div className='gamesContainer'>
                           <div className='game'></div>
                           <div className='game'></div>
                           <div className='game'></div>
                        </div>
                        <button>Casual / Chill</button>
                        <p>Looking for people to play some casual games
                           with after work. I don't care about winning or 
                           losing, just looking for good vibes and laughs 
                           on Discord. I usually play Support!
                        </p>
                        <div className='buttonsMatch'>
                           <button>Nope</button>
                           <button>Match</button>
                        </div>
                     </div>
                  </div>
               </div>
               <div className='filterContainer'>

               </div>
         </div>

      </div>
   );
}