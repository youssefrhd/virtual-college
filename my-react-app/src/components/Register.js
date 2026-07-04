import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Register.css';


const Register = () => {
    const navigate = useNavigate();
    const handleRegister = (e) => {
        e.preventDefault(); // Stoppt das automatische Neuladen der Seite
        navigate('/login'); // Wechselt sicher zur Login-Seite (alles klein geschrieben!)
    };

  return(
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-subtitle">Campus-Verwaltung</h2>
        <h3 className="register-heading">Registrieren</h3>

        <form id='register-form' onSubmit={handleRegister}> 
            <input className="register-input" type="email" placeholder="Benutzername" required />
            <input className="register-input" type="password" placeholder="Passwort" required />
            <input className="register-input" type="password" placeholder="Passwort wiederholen" required />

            <select className="register-select">
                <option value="student">Student</option>
                <option value="lehrende">Lehrende/r</option>
                <option value="admin">Administrator</option>
            </select>
        
            <button className="register-button" type="submit">Registrieren</button>
        </form>
        <p className="register-link-row">
          Ich habe bereits ein Konto? <Link className="register-link" to="/login">Hier anmelden</Link>
        </p>
      </div>
    </div>

  )};




export default Register;