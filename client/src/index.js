import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthStore from './store/AuthStore';
import CatalogStore from './store/CatalogStore';
import OrderStore from './store/OrderStore';

export const Context = createContext(null);

ReactDOM.render(
    <Context.Provider value={{
        auth: new AuthStore(),
        catalog: new CatalogStore(),
        order: new OrderStore(),
    }}>
        <App />
    </Context.Provider>,

    document.getElementById('root')
);