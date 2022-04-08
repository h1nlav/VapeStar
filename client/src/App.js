import React, { useContext, useEffect, useState } from "react";
import jwt_decode from 'jwt-decode';
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { Context } from ".";
import { checkAuth } from "./api/userApi.js";
import FirstEntryLoader from "./components/Loaders/FirstEntryLoader/FirstEntryLoader";
import './css/reset.css';
import './css/App.css';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const { auth, order } = useContext(Context);

    useEffect(async () => {
        setIsLoading(true);
        await checkAuth().then(data => {
            if (data.token) {
                auth.setUser(jwt_decode(data.token));
                auth.setIsAuth(true);
            }
            order.setCart(JSON.parse(localStorage.getItem('cart')) || []);
        }).finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return (<FirstEntryLoader />)
    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    );
}

export default App;
