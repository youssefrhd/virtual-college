import React from 'react';
import './Studienfortschritt.css';
import Header from "./Header";
import { prüfungarray } from './daten';


function Studienfortschritt({ pruefungen = prüfungarray }) {
  const GESAMT_ECTS = 210; 

  const bestandenePruefungen = pruefungen.filter(item => item.status === "bestanden");
  const offenePruefungen = pruefungen.filter(item => item.status === "offen" || item.status === "eingeschrieben");
  
  const erreichteEcts = bestandenePruefungen.reduce((sum, item) => sum + item.ects, 0);
  const prozent = Math.round((erreichteEcts / GESAMT_ECTS) * 100);

  let notenschnitt = "0.0";
  if (erreichteEcts > 0) {
    const summeNoten = bestandenePruefungen.reduce((sum, item) => sum + (parseFloat(item.note) * item.ects), 0);
    notenschnitt = (summeNoten / erreichteEcts).toFixed(1); 
  }

  let motivationText = "Ein solider Start in dein Studium!";
  if (prozent >= 25) motivationText = "Bleib dran, das erste Viertel ist geschafft!";
  if (prozent >= 50) motivationText = "Halbzeit! Du bist auf einem super Weg.";
  if (prozent >= 75) motivationText = "Endspurt! Das Ziel ist in Sicht.";
  if (prozent === 100) motivationText = "Herzlichen Glückwunsch zum Abschluss!";

  return (
    <div className="fortschritt-card">
      <Header istangemeldet={true} />
      <div className="fortschritt-header">
         
        <div>
          <h3 className="fortschritt-title">Studienfortschritt</h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
            {motivationText}
          </p>
        </div>
        <div className="fortschritt-stats">
          <span>{erreichteEcts} / {GESAMT_ECTS} ECTS</span>
          <span style={{ marginLeft: '15px', color: '#2457c8', fontWeight: 'bold' }}>
            {prozent}%
          </span>
        </div>
      </div>

      <div className="progress-track" style={{ marginBottom: '1rem' }}>
        <div className="progress-fill" style={{ width: `${prozent}%` }}></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#4b5563', borderTop: '1px solid #f3f4f6', paddingTop: '0.8rem' }}>
        <div>
          <strong>Ø Notendurchschnitt:</strong> <span style={{ color: '#1f2937' }}>{notenschnitt}</span>
        </div>
        <div>
          <strong>Bestanden:</strong> {bestandenePruefungen.length} Fächer
          <span style={{ margin: '0 8px', color: '#d1d5db' }}>|</span>
          <strong>Offen:</strong> {offenePruefungen.length} Fächer
        </div>
      </div>

      {bestandenePruefungen.length > 0 && (
        <div style={{ 
          marginTop: '15px', 
          paddingTop: '12px', 
          borderTop: '1px solid #e2e8f0', 
          fontSize: '0.9rem', 
          color: '#4b5563' 
        }}>
          <strong style={{ display: 'block', marginBottom: '8px', color: '#1f2937' }}>
            Punkte pro Modul:
          </strong>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            
            {bestandenePruefungen.map((fach, index) => (
              <li key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '6px 0', 
                borderBottom: '1px dashed #e5e7eb' 
              }}>
                <span>{fach.name}</span>
                <span style={{ fontWeight: '600', color: '#2457c8' }}>
                  +{fach.ects} ECTS
                </span>
              </li>
            ))}
            
          </ul>
        </div>
      )}

    </div>
  );
}

export default Studienfortschritt;