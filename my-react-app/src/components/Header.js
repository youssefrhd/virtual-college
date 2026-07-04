
import {useNavigate} from "react-router-dom";
import { useState } from "react";
import { HiAdjustments } from "react-icons/hi";
import { HiAcademicCap } from "react-icons/hi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { HiOutlineBars3 } from "react-icons/hi2";
import { CiLogout } from "react-icons/ci";
import './Header.css';

function Header({ istangemeldet }) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);


    return (
        <header className="App-header">
                    
                        {istangemeldet && (
                            <button className="App-link" id="menu-button" onClick={() => setIsOpen(!isOpen)}>
                                {isOpen ? <HiOutlineBars3 size={35}/> : <HiOutlineBars3 size={35}/>}
                            </button>
                        )}

                        {isOpen  && (
                            <div className="collapsible-contentHeader">
                                <button className="App-link" onClick={() => navigate('/profile')}><HiAdjustments />Profile</button> <br /> 
                                <button className="App-link" onClick={() => navigate('/module')}><IoDocumentTextOutline />Module</button> <br />
                                <button className="App-link" onClick={() => navigate('/prüfungen')}><HiAcademicCap />Prüfungen</button> <br />
                                <button className="App-link" onClick={() => navigate('/studienfortschritt')}>Studienfortschritt</button> <br /> 
                               
                            </div>
                        )}
                        <h1 className="App-title">Virtual College</h1>
                        {istangemeldet && (
                             <button className="header-button" id="logout-button" onClick={() => {
                                    localStorage.removeItem('istangemeldet');
                                    window.location.href = '/';
                                }}><CiLogout color="white" size={35}/></button>
                        )}
                    
                    
                    
            
        </header>
    );
}

export default Header