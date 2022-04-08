import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../..';
import { BodyScrollOff, BodyScrollOn } from '../../../utils/changeBodyScroll';
import styles from './AsidePanell.module.css';

const AsidePanell = observer(({ route, selectedOption, optionsList }) => {
    const { auth } = useContext(Context);

    const [isOptionsListOpened, setIsOptionsListOpened] = useState(false);
    useEffect(() => isOptionsListOpened ? BodyScrollOff() : BodyScrollOn(), [isOptionsListOpened]);

    return (
        <aside
            id='bg'
            className={`${styles.aside} ${isOptionsListOpened && styles.aside__active}`}
            onClick={e => e.target.id === 'bg' && setIsOptionsListOpened(false)}
        >
            <ul className={styles.aside__optionsList}>
                <Link
                    to={route + '/userInfo'}
                    onClick={() => setIsOptionsListOpened(false)}
                >
                    <li className={selectedOption === 'UserInfo'
                        ? `${styles.aside__option} ${styles.aside__userOption} ${styles.aside__optionSelected}`
                        : `${styles.aside__option} ${styles.aside__userOption}`
                    }>
                        <span>{auth.user.name} {auth.user.surname}</span><br />
                        <span>{auth.user.email}</span>
                    </li >
                </Link >

                {
                    optionsList.map(listOption =>
                        <Link
                            key={listOption}
                            to={route + '/' + listOption}
                            onClick={() => setIsOptionsListOpened(false)}
                        >
                            <li className={selectedOption === listOption
                                ? `${styles.aside__option} ${styles.aside__optionSelected}` : styles.aside__option}>
                                <span>{listOption[0].toUpperCase() + listOption.substring(1)}</span>
                            </li>
                        </Link>
                    )
                }

                {auth.user.role == 'ROOT' &&
                    <Link
                        to={route + '/admins'}
                        onClick={() => setIsOptionsListOpened(false)}
                    >
                        <li className={selectedOption === 'admins'
                                ? `${styles.aside__option} ${styles.aside__optionSelected}` : styles.aside__option}>
                                <span>Administrators</span>
                            </li>
                    </Link >
                }
            </ul >
            <div
                className={`${styles.aside__show} ${isOptionsListOpened && styles.aside__showActive}`}
                onClick={() => setIsOptionsListOpened(!isOptionsListOpened)}
            >
                <div />
            </div>
        </aside >
    );
});

export default AsidePanell;