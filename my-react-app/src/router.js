import Profil from "./components/Profil";
import Module from "./components/Module";
import Login from "./components/Login";
import Studienfortschritt from "./components/Studienfortschritt";
import Prüfungen from "./components/Prüfungen";
import ChangePassword from "./components/ChangePassword";
import Register from "./components/Register";
import { createBrowserRouter } from 'react-router-dom'

import App from './App'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Login />,
            },
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'Profil',
                element: <Profil />,
            },
            {
                path: 'changepassword',
                element: <ChangePassword />,
            },
            {
                path: 'module',
                element: <Module />,
            },
            {
                path: 'prüfungen',
                element: <Prüfungen />,
            },
            {
                path: 'studienfortschritt',
                element: <Studienfortschritt />,
            },
            {
                path: 'register',
                element: <Register />,
            }],
    },
])