import { Link, useLocation } from 'react-router-dom';
import './header.css';
import Card from '../user-card/Card';

function Header({ setHidden, isGetStartedHidden, isLoggedIn, logout, userData }) {
  // props.isHidden -> estat (boolea)
  // props.setHidden -> funcio per canviar l'estat al App
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className='contenidor-header'>
      <Link to="/" className="logo" onClick={() => props.setHidden(false)}>
        <img src="/public/img/mando.png" alt="logo" className="logo" />
        <p className="app-link" id="titol">PARTY-UP</p>
      </Link>

      <nav className='header-navbar'>
        {isDashboard ? (
          <div className="contenidor-headerDashboard"> {/*Si estem al dashboard es mostrarà aixo */}
              <div id='searchbar'>
                <img src="./public/img/lupa.png" className="lupa-img" alt="search" />
                <input type="text" name="cerca" id="cerca" placeholder="Search games or users" />
              </div>

              <div className='header-user'>
                  <img src="./public/img/campana.png" className="bell-img" alt="notifications" />
                  <img src="./public/img/message.png" className="message-img" alt="message"/>

                  <div className='containerHeader-user'>
                    <Card isHeader={true} userData={userData}/>
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
    </header>
  );
}

export default Header;