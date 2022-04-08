import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Routes, Route, useParams, useLocation } from 'react-router-dom';
import { Context } from '..';

import { adminRoutes, authRoutes, publicRoutes } from './routes';

const AppRouter = observer(() => {
    const { auth } = useContext(Context);
    return (
        <Routes>
            {publicRoutes.map(({ path, component }) =>
                <Route key={path} path={path} element={component} exact />
            )}

            {auth.isAuth && authRoutes.map(({ path, component }) =>
                <Route key={path} path={path} element={component} exact />
            )}

            {['ADMIN', 'ROOT'].includes(auth.user.role)
                && adminRoutes.map(({ path, component }) =>
                    <Route key={path} path={path} element={component} exact />
                )}
        </Routes>
    );
});

export default AppRouter;