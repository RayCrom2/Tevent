import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import EventsPage from './Pages/EventsPage';
import ProfilePage from './Pages/ProfilePage';
import Login from './components/Login'
import{
    createBrowserRouter,
    RouterProvider,
    Route,
} from "react-router-dom";

// Creates paths to Different Pagss 
const router = createBrowserRouter([
{
    path: "/",
    element: <Login/>,
},
{
    path: "Events",
    element: <EventsPage/>,
},
{
    path: "Profile",
    element: <ProfilePage/>,
},
{
    path: "Login",
    element: <Login/>,
},

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    //     <App />
    // </React.StrictMode>

     <RouterProvider router= {router}/>
);