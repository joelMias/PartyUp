import './main.css'

function Main() {
  return (
    <div id="contenidor-central">
            <h1 className='title'>Find Your</h1>
            <h1 className="colorLila title">Gaming Partner</h1>
            <p id="descripcio">Connect with gamers who share your passion, skill level, and schedule. Swipe, match, and game together in the ultimate gaming social platform.</p>
            <div id="botons-match">  
                <a href="/login" className="fonsLila botoCentre app-link">
                  <img src="/img/rayo.png" style={{ height: '20px' }} alt="rayo" />
                  Start Matching
                </a>

                <a href="/register" id="community" className="botoCentre app-link">
                  <img src="/public/img/comunity.png" style={{ height: '20px' }} />
                  Join Community
                </a>
            </div>
    </div>
  );
}

export default Main;
