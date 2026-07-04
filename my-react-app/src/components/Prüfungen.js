import React, { useState, useEffect } from 'react';
import './Prüfungen.css';
import { useNavigate } from "react-router-dom";
import { MdLogin } from "react-icons/md";
import { prüfungarray } from './daten';
import Header from "./Header";

function Prüfungen() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    
    return (
    <div className="Prüfungen">
      <Header istangemeldet={true} />
      <meta charset="utf-8" />  
      <h1 id="überschrift">Prüfungen</h1>
      <CollapsibleBlock prüfung={prüfungarray} status="bestanden" />
      <CollapsibleBlock prüfung={prüfungarray} status="eingeschrieben" />
      <CollapsibleBlock prüfung={prüfungarray} status="offen" />
      <p>
      Gesamte Ects: <EctsSum prüfung={prüfungarray} />
      </p>
        
    </div>
  );
}

  function CollapsibleBlock({ prüfung, status }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="collapsiblePrüfung">
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "<" : ">"}
      </button>
      {status === "bestanden" && <span>Bestanden</span>}
      {status === "eingeschrieben" && <span>Eingeschrieben</span>}
      {status === "offen" && <span>Offen</span>}

      {isOpen && (
        <div className="collapsible-contentPrüfung">
          {prüfung
            .filter((item) => item.status === status)
            .map((item, index) => (
              <CollapsibleBlockPrüfung key={index} prüfung={item} status={status} />
            ))}
            
        </div>
      )}
    </div>
    
  );
}

function CollapsibleBlockPrüfung({ prüfung, status }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="collapsiblePrüfung">
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "<" : ">"}
      </button>
      {prüfung.name}
      

      {isOpen && (
        <div className="collapsible-contentPrüfung">
          <p>
            <strong>{prüfung.name}</strong> — {prüfung.ects} ECTS, Note: {prüfung.note}, {prüfung.status}
            <br />
            {prüfung.datum} <br />
            {status === "offen" && <button><MdLogin size={25} /></button>}
          </p>
        </div>
      )}
    </div>
  );
}

function EctsSum({ prüfung }) {
  return prüfung.filter((item) => item.status == "bestanden").reduce((sum, item) => sum + item.ects, 0);
}

// class Prüfung {
//   constructor(name, ects, note, status, datum,){
//     this.name = name;
//     this.ects = ects;
//     this.note = note;
//     this.status = status;
//     this.datum = datum;
//   }

// }



// const prüfungarray = [
//   new Prüfung("Mathematik", 5, 4.0, "bestanden", "2026-09-01"),
//   new Prüfung("Informatik", 5, 1.7, "bestanden", "2026-09-15"),
//   new Prüfung("Physik", 5, "--", "eingeschrieben", "2027-02-10"),
//   new Prüfung("Deutsch", 5, "--", "offen", "2027-02-10")
// ];

class Anmeldung {
  constructor({
    anmeldungId = null,
    anmeldeDatum = null,
    status = null,
    student = null,
    pruefung = null,
    note = null,
    gewichtung = null,
    bestanden = null,
    eingetragenAm = null,
    versuchNr = null
  } = {}) {
    this.anmeldungId = anmeldungId
    this.anmeldeDatum = anmeldeDatum
    this.status = status
    this.student = student
    this.pruefung = pruefung
    this.note = note
    this.gewichtung = gewichtung
    this.bestanden = bestanden
    this.eingetragenAm = eingetragenAm
    this.versuchNr = versuchNr
  }

  getAnmeldungId() {
    return this.anmeldungId
  }

  getAnmeldeDatum() {
    return this.anmeldeDatum
  }

  setAnmeldeDatum(d) {
    this.anmeldeDatum = d
  }

  getStatus() {
    return this.status
  }

  getStudent() {
    return this.student
  }

  setStudent(student) {
    this.student = student
  }

  getPruefung() {
    return this.pruefung
  }

  setPruefung(pruefung) {
    this.pruefung = pruefung
  }

  setNote(note) {
    this.note = note
    this.bestanden = note != null && note <= 4.0
    this.eingetragenAm = new Date()
  }

  getNote() {
    return this.note
  }

  getGewichtung() {
    return this.gewichtung
  }

  setGewichtung(gewichtung) {
    this.gewichtung = gewichtung
  }

  getBestanden() {
    return this.bestanden
  }

  getEingetragenAm() {
    return this.eingetragenAm
  }

  getVersuchNr() {
    return this.versuchNr
  }

  setVersuchNr(versuchNr) {
    this.versuchNr = versuchNr
  }
}

export default Prüfungen;