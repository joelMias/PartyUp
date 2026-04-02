import './App.css'
import Header from './components/header/Header';
import { Routes, Route} from 'react-router-dom';
import Main from './components/main/Main';
import Login from './components/login/Login';
import Register from './components/register/Register';
import { useState, useEffect } from 'react';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  //Quan estigui en false, mostrar Get Started i quan estigui en true amagarlo
  const [isGetStartedHidden, setGetStartedHidden] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Comprovar si hi ha un usuari guardat al localStorage
    const storedUserRaw = localStorage.getItem("user");
    if (!storedUserRaw) return;

    const storedUser = JSON.parse(storedUserRaw);
    const params = new URLSearchParams(window.location.search);
    const steamStatus = params.get("steam");

    const steamConnectedByUrl =
      steamStatus === "connected" || steamStatus === "login-success";
    const steamConnectedStored =
      storedUser?.steamConnected === true ||
      storedUser?.description === "Steam connected";
    const steamConnected = steamConnectedByUrl || steamConnectedStored;

    const updatedUser = {
      ...storedUser,
      steamConnected,
      description: steamConnected ? "Steam connected" : "Steam not connected",
    };

    setUserData(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    if (steamStatus) {
      // Netegem el query param per evitar re-aplicar canvis en refresh.
      window.history.replaceState({}, "", window.location.pathname);
    }

    setIsLoggedIn(true);
  }, []);

  //Aquesta funcio, la pasarem als fills per poder manipular l'estat
  function handleSetGetStartedHidden(value) {
    setGetStartedHidden(value);
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setUserData(null);
  }

  return (
    <div id='contenidor-general'>
      <Header
        setHidden={handleSetGetStartedHidden}
        isGetStartedHidden={isGetStartedHidden}
        isLoggedIn={isLoggedIn}
        logout={handleLogout}
        userData={userData}
      />
      
      <Routes>
        <Route path="/" element={<Main />}/>
        {/*<Route  path="/login" element={<Login />} />*/}
        
        <Route  path="/register" 
        // Li passem la funcio perque el registre pugui ocultar el header
        element={<Register setHidden={handleSetGetStartedHidden} />} />

        <Route  path="/login" 
        // Li passem la funcio perque el registre pugui ocultar el header
        element={<Login 
                    setHidden={handleSetGetStartedHidden} 
                    setIsLoggedIn={setIsLoggedIn}
                    setUserData={setUserData}/>
                } 
        />

        <Route  path="/dashboard" element={<Dashboard />} />

      </Routes>
    </div>
  )
}

export default App
