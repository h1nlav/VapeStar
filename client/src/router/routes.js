
import NavBarFooterWrapper from '../NavBarFooterWrapper';
import ActivationPage from '../pages/ActivationPage';
import AdminPage from '../pages/AdminPage';
import CatalogPage from '../pages/CatalogPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import CheckoutOrderPage from '../pages/CheckoutOrderPage';
import ErrorPage from '../pages/ErrorPage';
import MainPage from '../pages/MainPage';
import ProductPage from '../pages/ProductPage';
import SearchPage from '../pages/SearchPage';
import UserPage from '../pages/UserPage';
import { ADMIN_ROUTE, CATALOG_ROUTE, MAIN_ROUTE, PRODUCT_ROUTE, USER_ROUTE, CHECKOUT_ROUTE, ACTIVATION_ROUTE, CHANGE_PASSWORD_ROUTE, SEARCH_ROUTE } from './consts';

export const publicRoutes = [
    { path: MAIN_ROUTE, component: <NavBarFooterWrapper component={<MainPage />} /> },
    { path: CATALOG_ROUTE + '/:ctg', component: <NavBarFooterWrapper component={<CatalogPage />} /> },
    { path: CATALOG_ROUTE + '/:ctg' + '/:params', component: <NavBarFooterWrapper component={<CatalogPage />} /> },
    { path: SEARCH_ROUTE + '/:params', component: <NavBarFooterWrapper component={<SearchPage />} /> },
    { path: PRODUCT_ROUTE + '/:id', component: <NavBarFooterWrapper component={<ProductPage />} /> },
    { path: CHECKOUT_ROUTE, component: <NavBarFooterWrapper component={<CheckoutOrderPage />} /> },

    { path: ACTIVATION_ROUTE + '/:activationLink', component: <ActivationPage /> },
    { path: CHANGE_PASSWORD_ROUTE + '/:changePasswordLink', component: <ChangePasswordPage /> },
    { path: '*', component: <NavBarFooterWrapper component={<ErrorPage />} /> },
];

export const authRoutes = [
    { path: USER_ROUTE, component: <NavBarFooterWrapper component={<UserPage />} /> },
    { path: USER_ROUTE + '/:option', component: <NavBarFooterWrapper component={<UserPage />} /> },
]

export const adminRoutes = [
    { path: ADMIN_ROUTE, component: <NavBarFooterWrapper component={<AdminPage />} /> },
    { path: ADMIN_ROUTE + '/:option', component: <NavBarFooterWrapper component={<AdminPage />} /> },
]