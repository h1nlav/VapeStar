import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { USER_ROUTE } from '../router/consts';
import UserPersonalInfo from '../components/UserPage/UserPersonalInfo/UserPersonalInfo/UserPersonalInfo';
import UserOrdersList from '../components/UserPage/UserOrders/UserOrdersList/UserOrdersList';
import UserReviews from '../components/UserPage/UserReviews/UserReviews/UserReviews';
import styles from '../css/UserPage.module.css';
import AsidePanell from '../components/UI/AsidePanell/AsidePanell';
import { useEffect } from 'react';
import { BodyScrollOff } from '../utils/changeBodyScroll';

const UserPage = observer(() => {
    const { option } = useParams();

    useEffect(() => BodyScrollOff(), []);

    const switchOptionEl = (option) => {
        switch (option) {
            case 'userInfo': return <UserPersonalInfo />;
            case 'orders': return <UserOrdersList />
            case 'reviews': return <UserReviews />;
            default: return <UserPersonalInfo />;
        }
    }

    return (
        <div className={styles.userPage}>
            <AsidePanell route={USER_ROUTE} selectedOption={option} optionsList={['orders', 'reviews']} />

            <div className={styles.userPage__content}>
                {switchOptionEl(option)}
            </div>
        </div >
    );
});

export default UserPage;