import React from 'react';
import { useState } from "react";
import {useNavigate} from "react-router-dom"; 
import './ChangePassword';


const ChangePassword = () => {
  const navigate = useNavigate();
  return(
    <div className="passreset-container">
      <h1>Digitaler Campus</h1>
      <h2>Interaktive 2D-Karte & Campus-Verwaltung</h2>
      <h2>Passwort zurücksetzen </h2>
      <form> 
        <div>
          <label> <input type="password" placeholder = "Neues Passwort" required /></label>
        </div>
        <div>
          <label> <input type="password"  placeholder = "Neues Passwort wiederholen" required /></label>
        </div>
        <button type="submit" onClick={() => navigate('/profile')}>Passwort erstellen</button>
      </form>

    </div>

  )};

  export default ChangePassword;