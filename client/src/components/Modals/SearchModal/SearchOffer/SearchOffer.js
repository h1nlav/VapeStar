import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCT_ROUTE } from '../../../../router/consts';

import styles from './SearchOffer.module.css';

const SearchItem = ({ offer, closeModal }) => {
    const offerName = useRef(null);

    return (
        <li>
            <Link
                to={PRODUCT_ROUTE + '/' + offer.id}
                className={styles.offer}
                onMouseMove={() => offerName.current.style.textDecoration = 'underline'}
                onTouchStart={() => offerName.current.style.textDecoration = 'underline'}
                onMouseLeave={() => offerName.current.style = 'none'}
                onTouchEnd={() => offerName.current.style = 'none'}
                onClick={() => closeModal()}
            >
                <div className={styles.offer__left}>
                    <div className={styles.offer__image} >
                        <img src={process.env.REACT_APP_API_URL + '/img/' + offer.products_pics[0].fileName} />
                    </div>
                    <div ref={offerName} className={styles.offer__name}>
                        <span>
                            {offer.name}
                        </span>
                    </div>
                </div>

                <div className={styles.offer__price}>
                    {offer.price.toLocaleString()} $
                </div>
            </Link>
        </li >
    );
};

export default SearchItem;