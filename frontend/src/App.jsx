import './App.css'
import Header from './components/header/Header';
import { Routes, Route} from 'react-router-dom';
import Main from './components/main/Main';
import Login from './components/login/Login';
import Register from './components/register/Register';
import { useState } from 'react';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  //Quan estigui en false, mostrar Get Started i quan estigui en true amagarlo
  const [isGetStartedHidden, setGetStartedHidden] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Aquesta funcio, la pasarem als fills per poder manipular l'estat
  function handleSetGetStartedHidden(value) {
    setGetStartedHidden(value);
  }

  function handleLogout() {
    setIsLoggedIn(false);
  }

  return (
    <div id='contenidor-general'>
      <Header
        setHidden={handleSetGetStartedHidden}
        isGetStartedHidden={isGetStartedHidden}
        isLoggedIn={isLoggedIn}
        logout={handleLogout}
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
                    setIsLoggedIn={setIsLoggedIn}/>} 
        />

        <Route  path="/dashboard" element={<Dashboard />}/>

      </Routes>
    </div>
  )
}

export default App
