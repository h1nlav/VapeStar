import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '..';
import { ADMIN_ROUTE } from '../router/consts';
import AsidePanell from '../components/UI/AsidePanell/AsidePanell';
import UserPersonalInfo from '../components/UserPage/UserPersonalInfo/UserPersonalInfo/UserPersonalInfo';
import AdminOrders from '../components/AdminPage/AdminOrders/AdminOrders/AdminOrders';
import AdminCategoriesList from '../components/AdminPage/AdminCategories/AdminCategoriesList/AdminCategoriesList';
import AdminProducts from '../components/AdminPage/AdminProducts/AdminProducts/AdminProducts';
import AdminUsersList from '../components/AdminPage/AdminUsers/AdminUsersList/AdminUsersList';
import AdminDelivery from '../components/AdminPage/AdminDelivery/AdminDelivery/AdminDelivery';
import AdminPaymentOptionsList from '../components/AdminPage/AdminPaymentOptions/AdminPaymentOptionsList/AdminPaymentOptionsList';
import AdminReviews from '../components/AdminPage/AdminRewiews/AdminReviews';
import AdminAdminsList from '../components/AdminPage/AdminAdmins/AdminAdminsList/AdminAdminsList';
import styles from '../css/AdminPage.module.css';

const AdminPage = observer(() => {
    const { auth } = useContext(Context);
    const { option } = useParams();

    const switchOptionEl = (option) => {
        switch (option) {
            case 'userInfo': return <UserPersonalInfo />;
            case 'orders': return <AdminOrders />;
            case 'categories': return <AdminCategoriesList />;
            case 'products': return <AdminProducts />;
            case 'reviews': return <AdminReviews />;
            case 'delivery': return <AdminDelivery />;
            case 'payment': return <AdminPaymentOptionsList />
            case 'users': return <AdminUsersList />;
            case 'admins': {
                if (auth.user.role == 'ROOT') return <AdminAdminsList />;
                else return <UserPersonalInfo />;
            }
            default: return <UserPersonalInfo />;
        }
    }

    return (
        <div className={styles.adminPage}>
            <AsidePanell route={ADMIN_ROUTE} selectedOption={option}
                optionsList={['orders', 'categories', 'products', 'reviews', 'delivery', 'payment', 'users']}
            />

            <div className={styles.adminPage__content}>
                {switchOptionEl(option)}
            </div>
        </div >
    );
});

export default AdminPage;