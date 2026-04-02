import * as React from "react";
import "./dashboard.css";
import { useLocation } from "react-router-dom";
import Card from "../user-card/Card";
import { Form, FormGroup, Label, Input, FormText, Button } from "reactstrap";
import MatchCard from "../matchCard/MatchCard";

export default function Dashboard() {
  const location = useLocation();
  const [matches, setMatches] = React.useState([]);
  const [stateSwitch, setStateSwitch] = React.useState(false);
  const [potentialMatches, setPotentialMatches] = React.useState([]);
  const [numMatches, setNumMatches] = React.useState(potentialMatches.length);

  //Aquesta funcio serveix per passar al seguent element del array de matches (següent card)
  const handleNext = () => {
    setPotentialMatches((prev) => prev.slice(1));
    setNumMatches((prev) => prev - 1);
  };

  //Aquesta funcio, serveix per parsejar respostes JSON de forma segura
  //La vaig fer perque si el backend retornaba algo erroni, al intentar de fer el parse petaba per elements HTML <br>....
  const parseJsonResponse = async (response, label) => {
    const rawText = await response.text();

    try {
      return JSON.parse(rawText);
    } catch (error) {
      console.error(`Resposta no-JSON a ${label}:`, rawText);
      throw new Error(`Resposta invàlida de ${label}: ${error.message}`);
    }
  };

  //Funcio que refresca totes les dades del dashboard (jocs, amistads, matches)
  const refreshDashboard = async () => {
    try {
      //Aqui fem 3 peticions en paral·lel per tal de ferles totes a l'hora
      const [matchesRes, potentialRes, gamesRes] = await Promise.all([
        fetch("/api/getMatches.php", { credentials: "include" }),
        fetch("/api/getPotentialMatches.php", { credentials: "include" }),
        fetch("/api/getUserGames.php", { credentials: "include" }),
      ]);

      const matchesData = await parseJsonResponse(matchesRes, "getMatches.php");
      //si a l'hora de fer el parse s'ha conseguit un array, es guarda
      setMatches(Array.isArray(matchesData) ? matchesData : []);

      //el mateix amb els matches pero només guardo els matches si es un array
      const potentialData = await parseJsonResponse(
        potentialRes,
        "getPotentialMatches.php",
      );
      setPotentialMatches(
        Array.isArray(potentialData.potential_matches)
          ? potentialData.potential_matches
          : [],
      );

      //el mateix amb els jocs
      const gamesData = await parseJsonResponse(gamesRes, "getUserGames.php");

      console.log("Potential:", potentialData);
    } catch (error) {
      console.error("Error carregant dashboard:", error);
    }
  };

  //quan entrem (login) el primer que fem es recollir totes les dades
  React.useEffect(() => {
    refreshDashboard();
  }, []);


  //Aquest use effect, es per poder escoltar el eent de refresh de la pàgina.
  //Si no ho feia amb un altre useEffect, no feia res el boto del refreshDashboard
  React.useEffect(() => {

    //Creem la funcio per refrescar
    const handleRefresh = () => {
      refreshDashboard();
    };

    //Creem un event que estara tot el rato esperant a que s'envii un event per ref el refresh
    window.addEventListener("refresh-dashboard", handleRefresh);

    //Al desmuntar el component, borrem el listener
    return () => {
      window.removeEventListener("refresh-dashboard", handleRefresh);
    };
  }, []);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div id="searchbar-friends">
          <img src="./public/img/lupa.png" className="lupa-img" alt="search" />
          <input
            type="text"
            name="cerca"
            id="cerca-friends"
            placeholder="Search friends or chats"
          />
        </div>

        <h2>Friends</h2>
        <div className="friends-container">
          {/*Recorrem tots els matches i es crea una card per cada amic (match)*/}
          {matches.map((match) => (
            <Card key={match.id} match={match} />
          ))}
        </div>

        <h2>Chats</h2>
      </div>

      <div className="mainContainer"> 
        {/*<div className="matchStack">
          <div className="matchCard">
            <div className="avatarContainer">
              <img src="./public/img/User-avatar.png" className="avatarImg" />
            </div>
            <div className="infoContainer">
              <h1>User Name</h1>
              <div className="gamesContainer">
                <div className="game"></div>
                <div className="game"></div>
                <div className="game"></div>
              </div>
              <button className="gameStyleButton">Casual / Chill</button>
              <p>
                Looking for people to play some casual games with after work. I
                don't care about winning or losing, just looking for good vibes
                and laughs on Discord. I usually play Support!
              </p>
              <div className="buttonsMatch">
                <button className="buttonNope">Nope</button>
                <button className="buttonMatch">Match</button>
              </div>
            </div>
          </div>

          <div className="matchCard">
            <div className="avatarContainer">
              <img src="./public/img/User-avatar.png" className="avatarImg" />
            </div>
            <div className="infoContainer">
              <h1>User Name</h1>
              <div className="gamesContainer">
                <div className="game"></div>
                <div className="game"></div>
                <div className="game"></div>
              </div>
              <button className="gameStyleButton">Casual / Chill</button>
              <p>
                Looking for people to play some casual games with after work. I
                don't care about winning or losing, just looking for good vibes
                and laughs on Discord. I usually play Support!
              </p>
              <div className="buttonsMatch">
                <button className="buttonNope">Nope</button>
                <button className="buttonMatch">Match</button>
              </div>
            </div>
          </div>

          <div className="matchCard">
            <div className="avatarContainer">
              <img src="./public/img/User-avatar.png" className="avatarImg" />
            </div>
            <div className="infoContainer">
              <h1>User Name</h1>
              <div className="gamesContainer">
                <div className="game"></div>
                <div className="game"></div>
                <div className="game"></div>
              </div>
              <button className="gameStyleButton">Casual / Chill</button>
              <p>
                Looking for people to play some casual games with after work. I
                don't care about winning or losing, just looking for good vibes
                and laughs on Discord. I usually play Support!
              </p>
              <div className="buttonsMatch">
                <button className="buttonNope">Nope</button>
                <button className="buttonMatch">Match</button>
              </div>
            </div>
          </div>
        </div>*/}

        {/*Recorrem tots els matches només en el cas de que tinguis algun match. Si no hi ha cap tirem missatge*/}
        {potentialMatches.length > 0 && (
          <div className="potentialMatches">
            <div className="potentialMatchesContainer">
              {potentialMatches && potentialMatches.length > 0 ? (
                potentialMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onNope={handleNext}
                    onMatch={handleNext}
                  />
                ))
              ) : (
                <p>No more matches 😢</p>
              )}
            </div>
          </div>
        )}
        <div className="filterContainer">
          <div className="filerForm">
            <h1>Filters</h1>

            <Form className="form">
              <FormGroup className="formGroupFilter">
                <Label for="games">Game</Label>
                <Input id="games" name="games" type="select">
                  <option>Any Game</option>
                  <option>Selected Games</option>
                </Input>
              </FormGroup>

              <FormGroup className="formGroupFilter">
                <Label for="gameStyle">Game Style</Label>
                <Input id="gameStyle" name="gameStyle" type="select">
                  <option>Both</option>
                  <option>Chill/Casual</option>
                  <option>Competitive</option>
                </Input>
              </FormGroup>

              <FormGroup className="formGroupFilter">
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
            <div className="c">
              <div className="stat">
                <div className="containerEsquerra">
                  <img src="./public/img/rayo2.png" className="logoStat" />
                  <p>Matches</p>
                </div>
                <p>{matches.length}</p>
              </div>
              <div className="stat">
                <div className="containerEsquerra">
                  <img src="./public/img/mando2.png" className="logoStat" />
                  <p>Games</p>
                </div>
                {/*<p>{games.length}</p>*/}
              </div>
              <div className="stat">
                <div className="containerEsquerra">
                  <img src="./public/img/cuenta.png" className="logoStat" />
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
