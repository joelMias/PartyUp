import React from 'react';
import './steamLogin.css';

export default function SteamLoginButton() {
  const steamLogin = () => {
    window.location.href = "http://localhost/projecte/PartyUpRepo/backend/api/auth/steam.php";
  };

  return (
    <button onClick={steamLogin} className="buttonSteam">
      <img className="imgSteam" src="./public/img/steamLogo.png" alt="Steam" />
      <span>Iniciar sesión con Steam</span>
    </button>
  );
}