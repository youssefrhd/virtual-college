import './Profil.css';
import React from 'react';
import { useState } from "react";
import {useNavigate} from "react-router-dom";
import Header from "./Header"

function Profil() {
    const navigate = useNavigate();
    
  return (
    <div className="App">
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <header >
        <Header istangemeldet={true} />
        <div className="Profile">
          <h1 id="profile-title">Profile</h1>  
          <div className="user-info">
            {user1.name}, {user1.nachname} <br />
          </div>
          <div className="user-info"> 
            {user1.email} <br />
          </div>
          < div className="user-info">
            {user1.rolle} <br />
          </div>
          <div className="user-info">
            {user1.matrikelnummer} <br />
          </div>
          <div className="user-info">
            <button onClick={() => navigate('/changepassword')}>Change Password</button> <br /> 
          </div>
          <div className="user-info">
            <h2>Modules</h2>
            <ul>
              {user1.module.map((module, index) => (
                <li key={index}>{module}</li>
              ))}
            </ul>
          </div>

        </div>
      </header>
     
    </div>
  );
}



class User {
  constructor(name, nachname, email, rolle, matrikelnummer, passwort, module){
    this.name = name;
    this.nachname = nachname;
    this.email = email;
    this.rolle = rolle;
    this.matrikelnummer = matrikelnummer;
    this.passwort = passwort;
    this.module = module;
  }

}


const user1 = new User("Max", "Mustermann", "max.mustermann@example.com", "Student", "123456", "password", ["Mathematik", "Physik"]);

export default Profil