import * as React from "react";
import "./matchcard.css";

export default function MatchCard({ match, onNope, onMatch }) {
  if (!match) {
    return null;
  }

  function handleNope() {
    onNope();

    let idUser = match.id;

    fetch("/api/match.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idUser })
      .then((res) => res.json())
      .then((data) => {
        console.log("Respuesta:", data);
      })
      .catch((err) => {
        console.error("Error:", err);
      })
    });
  }

  return (
    <div className="matchCard">
      <div className="avatarContainer">
        <img
          src={match.avatar_url || "./public/img/User-avatar.png"}
          className="avatarImg"
          alt={`${match.name || "User"}'s avatar`}
        />
      </div>
      <div className="infoContainer">
        <h1>{match.username || "Unknown user"}</h1>
        <div className="gamesContainer">
          {(match.common_game_images || []).map((image, index) => (
            <div className="game" key={index}>
              <img src={image} alt="Common game" />
            </div>
          ))}
        </div>
        <button className="gameStyleButton">
          {match.play_style || "both"}
        </button>
        <p>{match.bio || "No bio yet."}</p>
        <div className="buttonsMatch">
          <button className="buttonNope" onClick={handleNope}>
            Nope
          </button>
          <button className="buttonMatch" onClick={onMatch}>
            Match
          </button>
        </div>
      </div>
    </div>
  );
}
