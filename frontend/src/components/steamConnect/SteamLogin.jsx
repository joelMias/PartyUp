import React from 'react';
import './steamLogin.css';

export default function SteamLoginButton({ isConnected = false }) {
  const steamLogin = () => {
    if (isConnected) return;
    window.location.href = "http://localhost/projecte/PartyUpRepo/backend/api/auth/steam.php";
  };

  return (
    <button onClick={steamLogin} className="buttonSteam" disabled={isConnected}>
      <img className="imgSteam" src="./public/img/steamLogo.png" alt="Steam" />
      <span>{isConnected ? "Steam connected" : "Iniciar sesión con Steam"}</span>
    </button>
  );
}