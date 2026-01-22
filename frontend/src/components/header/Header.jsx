import { Link } from 'react-router-dom';
import './header.css';


function Header(props) {
  // props.isHidden -> estat (boolea)
  // props.setHidden -> funcio per canviar l'estat al App

  return (
    <header className= 'contenidor-header'> 
      <Link to="/" className="logo" onClick={() => props.setHidden(false)}>
        <img src="/public/img/mando.png" alt="logo" className="logo" />
        <p className="app-link" id="titol">PARTY-UP</p>
      </Link>

      <nav>
        {/* Si isHidden es false → mostrem el boto */}
        {props.isHidden ? (
          // Si està ocult, posare un div buit amb la mateix amplada del Link, ja que sino es mou el logo cap a la dreta al ser un flex
          <div style={{ width: "110px" }}></div>
        ) : (
          <>
            <Link
              to="/register"
              id="register"
              className="fonsLila app-link"
              onClick={() => props.setHidden(true)}
            >
              Get Started
            </Link>

            <Link
              to="/login"
              id="login"
              className="fonsLila app-link"
              onClick={() => props.setHidden(true)}
            >
              Log In
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;