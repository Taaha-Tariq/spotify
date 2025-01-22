import React from "react";
import Login from './Login';
import Playlist from './Playlist';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";


function App () {
    const router = createBrowserRouter (createRoutesFromElements (
        <Route>
            <Route path='/' element={ <Login /> } />
            <Route path="/app" element={ <Playlist/> } />
        </Route>
    ));

    return (
        <RouterProvider router={router} />
    );
}

export default App;