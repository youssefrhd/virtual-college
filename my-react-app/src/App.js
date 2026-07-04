import './App.css'

import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import Profil from './components/Profil';

function App() {
    return (
      <div className="App" orientation="none" isolate>
            <Header />

            <Outlet />
      
      </div>
    );
}

export default App