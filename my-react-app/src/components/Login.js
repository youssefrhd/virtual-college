import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    
    // AuthContext vorerst deaktiviert, bis ihr ihn wirklich braucht
    // const { setIstangemeldet } = useContext(AuthContext); 

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: perform real authentication here
        
        // setIstangemeldet(true);
        localStorage.setItem('istangemeldet', 'true');
        navigate('/profil');
    }; // <-- Diese Klammer war vermutlich das Problem!

  return(
    <div className="login-container">
      <h1>Digitaler Campus</h1>
      <h2>Interaktive 2D-Karte & Campus-Verwaltung</h2>
      <form onSubmit={handleSubmit}> 
        <div>
          <label> <input type="email" placeholder="Benutzername" required /></label>
        </div>
        <div>
          <label> <input type="password" placeholder="Passwort" required /></label>
        </div>
        <button type="submit">Anmelden</button>
      </form>
      Passwort vergessen? <Link to="/changepassword">Hier zurücksetzen</Link>
      Ich habe noch kein Konto? <Link to="/register">Hier registrieren</Link>
    </div>
  );
};

export default Login;