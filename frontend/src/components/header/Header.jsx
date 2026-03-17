import { Link, useLocation } from "react-router-dom";
import "./header.css";
import Card from "../user-card/Card";
import { useState } from "react";
import ContainerOption from "../containerOption/ContainerOption";

function Header({
  setHidden,
  isGetStartedHidden,
  isLoggedIn,
  logout,
  userData,
}) {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [openContainer, setOpenContainer] = useState(true);
  const [selectGameContainer, setSelectGameContainer] = useState(false);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setOpenMenu(false);
    if (option === "logout") {
      logout();
    }
  };

  const renderSelectedOption = () => {
    switch (selectedOption) {
      case "my-profile":
        return <Profile />;
      case "my-games":
        return <MyGames />;
      case "steam-connect":
        return <SteamConnect />;
      default:
        return null;
    }
  };

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <header className="contenidor-header">
      <Link to="/" className="logo" onClick={() => setHidden(false)}>
        <img src="/public/img/mando.png" alt="logo" className="logo" />
        <p className="app-link" id="titol">
          PARTY-UP
        </p>
      </Link>

      <nav className="header-navbar">
        {isDashboard ? (
          <div className="contenidor-headerDashboard">
            {" "}
            {/*Si estem al dashboard es mostrarà aixo */}
            <div id="searchbar">
              <img
                src="./public/img/lupa.png"
                className="lupa-img"
                alt="search"
              />
              <input
                type="text"
                name="cerca"
                id="cerca"
                placeholder="Search games or users"
              />
            </div>
            <div className="header-user">
              <img
                src="./public/img/campana.png"
                className="bell-img"
                alt="notifications"
              />

              <div className="containerHeader-user">
                <Card
                  isHeader={true}
                  userData={userData}
                  toggleMenu={toggleMenu}
                />
              </div>

              <div className="containerRefresh">
                <img src="./public/img/actualizar.png" className="imgRefresh" />
              </div>
            </div>
          </div>
        ) : (
          <div className="container-linksLogin">
            <Link
              to="/register"
              className="fonsLila app-link"
              onClick={() => setHidden(true)}
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="fonsLila app-link"
              onClick={() => setHidden(true)}
            >
              Log In
            </Link>
          </div>
        )}
      </nav>

      {openMenu && (
        <div className="dropdownMenu">
          <div className="my-profile optionMenu" onClick={() => { setSelectedOption("my-profile"); setOpenContainer(true); }}>
            <img src="./public/img/account-menu.png" alt="Profile" /> My Profile
          </div>
          <div className="my-games optionMenu" onClick={() => { setSelectedOption("my-games"); setOpenContainer(true); setSelectGameContainer(true); }}>
            <img src="./public/img/games-menu.png" alt="Profile" /> My Games
          </div>
          <div className="steam-connect optionMenu" onClick={() => { setSelectedOption("steam-connect"); setOpenContainer(true); }}>
            <img src="./public/img/noSteam-connected.png" alt="Profile" /> Steam
            Connect
          </div>
          <div className="logout optionMenu" onClick={() => { setSelectedOption("logout"); setOpenContainer(true); }}>
            <img src="./public/img/logout-menu.png" alt="Profile" /> Logout
          </div>
        </div>
      )}

      {(openContainer && selectedOption) && (
        <div className="containerOption">
          <ContainerOption
            title={selectedOption} 
            icon={selectGameContainer ? userData?.avatar : false}
            close={() => setOpenContainer(false)}
          />
        </div>          
      )}
    </header>
  );
}

export default Header;
