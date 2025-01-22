import React from "react";
import Login from './components/Login';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import JamSession from "./components/Jamming(functional)";

function App () {
    // Making routes for the website
    // The login page will be rendered at the path '/'
    // The main interface of the website will be rendered at '/app'
    const router = createBrowserRouter (createRoutesFromElements (
        <Route>
            <Route path='/' element={ <Login /> } />
            <Route path="/app" element={ <JamSession/> } />
        </Route>
    ));
    
    // Returning the router
    return (
        <RouterProvider router={router} />
    );
}

export default App;