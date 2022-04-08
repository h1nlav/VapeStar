import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { changePassword, checkChangePasswordLink } from '../api/userApi';
import { MAIN_ROUTE } from '../router/consts';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import styles from '../css/ChangePasswordPage.module.css';
import DotsLoader from '../components/Loaders/DotsLoader/DotsLoader';
import AlertsList from '../components/UI/AlertsList/AlertsList';

const ChangePasswordPage = observer(() => {
    const { auth } = useContext(Context)
    const { changePasswordLink } = useParams();

    const [isLinKChecked, setIsLinkChecked] = useState(0);
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);

    useEffect(async () => {
        await checkChangePasswordLink(changePasswordLink)
            .then(data => {
                if (data.confirmation) setIsLinkChecked(1);
                else setIsLinkChecked(-1);
            });
    }, [changePasswordLink]);

    const changePasswordAttempt = async () => {
        !auth.regPassword && auth.setRegPassword('');
        if (auth.regPasswordCheck.length == 0) {
            await changePassword({
                link: changePasswordLink,
                password: auth.regPassword,
            }).then(data => {
                if (data.confirmation) setIsPasswordChanged(true);
                else setIsLinkChecked(-1);
            })
        }
    }

    return (
        <div className={styles.changePassword}>
            {isLinKChecked == 0 &&
                <div className={styles.changePassword__content}>
                    <span className={styles.changePassword__text}>Link validation</span>
                    <DotsLoader />
                </div>
            }
            {isLinKChecked == -1 &&
                <div className={styles.changePassword__content}>
                    <div className={`${styles.changePassword__icon} ${styles.changePassword__iconCross}`} />
                    <span className={styles.changePassword__text}>
                        Link expired
                    </span>
                    <Link to={MAIN_ROUTE} className={styles.changePassword__link}>
                        <button className={styles.changePassword__button}>
                            <span>To Home Page</span>
                        </button>
                    </Link>
                </div>
            }
            {isLinKChecked == 1 &&
                (isPasswordChanged
                    ?
                    <div className={styles.changePassword__content}>
                        <div className={`${styles.changePassword__icon} ${styles.passwordChanged__iconMarked}`} />
                        <span className={styles.changePassword__text}>Password changed</span>
                        <Link to={MAIN_ROUTE} className={styles.changePassword__link}>
                            <button className={styles.changePassword__button}>
                                <span>To Home Page</span>
                            </button>
                        </Link>
                    </div>
                    :
                    <div className={styles.changePassword__content}>
                        <span className={styles.changePassword__text}>Create a new password</span>
                        <input
                            type={'text'}
                            className={styles.changePassword__input}
                            style={auth.regPasswordCheck.length == 0 ? { borderColor: '#797878' } : { borderColor: '#f84147' }}
                            value={auth.regPassword || ''}
                            onChange={e => auth.setRegPassword(e.target.value)}
                        />
                        <AlertsList checkArray={auth.regPasswordCheck} />

                        <button className={styles.changePassword__button}
                            onClick={() => changePasswordAttempt()}
                        >
                            <span>Change password</span>
                        </button>
                    </div>
                )
            }
        </div >
    );
});

export default ChangePasswordPage;