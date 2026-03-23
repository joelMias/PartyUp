import * as React from 'react';
import './dashboard.css';
import { useLocation } from 'react-router-dom';
import Card from '../user-card/Card';
import { Form, FormGroup, Label, Input, FormText, Button } from 'reactstrap';

export default function Dashboard() {
   const location = useLocation();
   const [matches, setMatches] = React.useState([]);
   const [stateSwitch, setStateSwitch] = React.useState(false);

   const refreshDashboard = async () => {
      //Aquest array, guardara 3 promeses una per cada fetch (peticio) al servidor i esperarem a que totes estiguin resoltes
      const [matchesRes, notificationsRes, gamesRes] = await Promise.all([
         fetch("/api/getMatches.php", { credentials: "include" }),
         /*fetch("/api/getNotifications.php"),*/
         fetch("/api/getUserGames.php", { credentials: "include" })
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
            <div className='matchStack'>
               
                  <div className='matchCard'>
                     <div className='avatarContainer'>
                        <img src="./public/img/User-avatar.png" className='avatarImg' />
                     </div>
                     <div className='infoContainer'>
                        <h1>User Name</h1>
                        <div className='gamesContainer'>
                           <div className='game'></div>
                           <div className='game'></div>
                           <div className='game'></div>
                        </div>
                        <button className='gameStyleButton'>Casual / Chill</button>
                        <p>Looking for people to play some casual games
                           with after work. I don't care about winning or
                           losing, just looking for good vibes and laughs
                           on Discord. I usually play Support!
                        </p>
                        <div className='buttonsMatch'>
                           <button className='buttonNope'>Nope</button>
                           <button className='buttonMatch'>Match</button>
                        </div>
                     </div>
                  </div>
               

               
                  <div className='matchCard'>
                     <div className='avatarContainer'>
                        <img src="./public/img/User-avatar.png" className='avatarImg' />
                     </div>
                     <div className='infoContainer'>
                        <h1>User Name</h1>
                        <div className='gamesContainer'>
                           <div className='game'></div>
                           <div className='game'></div>
                           <div className='game'></div>
                        </div>
                        <button className='gameStyleButton'>Casual / Chill</button>
                        <p>Looking for people to play some casual games
                           with after work. I don't care about winning or
                           losing, just looking for good vibes and laughs
                           on Discord. I usually play Support!
                        </p>
                        <div className='buttonsMatch'>
                           <button className='buttonNope'>Nope</button>
                           <button className='buttonMatch'>Match</button>
                        </div>
                     </div>
                  </div>
               
                  <div className='matchCard'>
                     <div className='avatarContainer'>
                        <img src="./public/img/User-avatar.png" className='avatarImg' />
                     </div>
                     <div className='infoContainer'>
                        <h1>User Name</h1>
                        <div className='gamesContainer'>
                           <div className='game'></div>
                           <div className='game'></div>
                           <div className='game'></div>
                        </div>
                        <button className='gameStyleButton'>Casual / Chill</button>
                        <p>Looking for people to play some casual games
                           with after work. I don't care about winning or
                           losing, just looking for good vibes and laughs
                           on Discord. I usually play Support!
                        </p>
                        <div className='buttonsMatch'>
                           <button className='buttonNope'>Nope</button>
                           <button className='buttonMatch'>Match</button>
                        </div>
                     </div>
                  </div>
               
            </div>
            <div className='filterContainer'>
               <div className='filerForm'>
                  <h1>Filters</h1>

                  <Form className='form'>
                     <FormGroup className='formGroupFilter'>
                        <Label for="games">Game</Label>
                        <Input
                           id='games'
                           name='games'
                           type="select"
                        >
                           <option>Any Game</option>
                           <option>Selected Games</option>
                        </Input>
                     </FormGroup>

                     <FormGroup className='formGroupFilter'>
                        <Label for="gameStyle">Game Style</Label>
                        <Input
                           id='gameStyle'
                           name='gameStyle'
                           type="select"
                        >
                           <option>Both</option>
                           <option>Chill/Casual</option>
                           <option>Competitive</option>
                        </Input>
                     </FormGroup>

                     <FormGroup className='formGroupFilter'>
                        <Label>Language</Label>

                        <label className="custom-switch">
                           <input
                              type="checkbox"
                              checked={stateSwitch}
                              onChange={() => setStateSwitch(!stateSwitch)}
                           />
                           <span className="slider"></span>
                        </label>
                     </FormGroup>
                  </Form>

                  <h1>Stats</h1>
                  <div className='c'>
                     <div className='stat'>
                        <div className='containerEsquerra'>
                           <img src="./public/img/rayo2.png" className='logoStat'/>
                           <p>Matches</p>
                        </div>
                        <p>{matches.length}</p>
                     </div>
                     <div className='stat'>
                        <div className='containerEsquerra'>
                           <img src="./public/img/mando2.png" className='logoStat'/>
                           <p>Games</p>
                        </div>
                        {/*<p>{games.length}</p>*/}
                     </div>
                     <div className='stat'>
                        <div className='containerEsquerra'>
                            <img src="./public/img/cuenta.png" className='logoStat'/>
                            <p>Friends</p>
                        </div>
                        {/*<p>{fiends.length}</p>*/}
                     </div>
                  </div>
               </div>
            </div>
         </div>

      </div>
   );
}