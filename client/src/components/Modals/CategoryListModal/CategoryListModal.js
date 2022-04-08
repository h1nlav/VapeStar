import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../..';
import { getAllCategories } from '../../../api/categoryApi';
import { CATALOG_ROUTE } from '../../../router/consts';
import { BodyScrollOff, BodyScrollOn } from '../../../utils/changeBodyScroll';
import Translit from '../../../utils/urlTransliteration';
import ModalName from '../../UI/ModalName/ModalName';
import styles from './CategoryListModal.module.css';

const CategoryListModal = observer(({ isVisible, closeModal, modalRef }) => {
    const { catalog } = useContext(Context);

    useEffect(async () => await getAllCategories().then(data => catalog.setCategories(data)), []);

    const [activeCategoryId, setActiveCategoryId] = useState(0);
    useEffect(() => isVisible ? BodyScrollOff() : (BodyScrollOn(), setActiveCategoryId(0)), [isVisible]);

    const [isBgDown, setIsBgDown] = useState(false);

    if (!isVisible) return (<div />);
    return (
        <div id='bg' ref={modalRef}
            className={styles.modal}
            onMouseDown={e => e.target.id == 'bg' && setIsBgDown(true)}
            onMouseUp={e => e.target.id == 'bg' && isBgDown && closeModal()}
        >
            <div className={activeCategoryId === 0 ? styles.categories : `${styles.categories} ${styles.categories__hidden}`}>
                <div className={styles.modalName}>
                    <ModalName modalName={'Catalog'} callback={() => closeModal()} />
                </div>
                <ul className={styles.categories__list}>
                    {catalog.categories.map(category =>
                        <li
                            key={category.id}
                            className={styles.categoryItem}
                            onClick={() => category.categories.length === 0 && closeModal()}
                        >
                            {category.categories.length === 0
                                ?
                                <Link to={CATALOG_ROUTE + '/' + Translit(category.name)} className={styles.categoryItem__wrapper}>
                                    <span className={styles.categoryItem__name}>{category.name}</span>
                                </Link>
                                :
                                <div
                                    id='makeCategoryActive'
                                    className={styles.categoryItem__wrapper}
                                    onClick={e => e.target.id === 'makeCategoryActive'
                                        && window.matchMedia("(max-width: 1025px)").matches
                                        && setActiveCategoryId(category.id)}
                                >
                                    <span id='makeCategoryActive' className={styles.categoryItem__name}>{category.name}</span>
                                    <div id='makeCategoryActive' className={styles.categoryItem__img} />
                                    <div id='bg' className={activeCategoryId === category.id ? `${styles.subcategories__wrapper} ${styles.subcategories__active}` : styles.subcategories__wrapper}>
                                        <div className={styles.subcategories}>
                                            <div className={styles.modalName}>
                                                <ModalName modalName={category.name} callback={() => closeModal()} />
                                            </div>

                                            <ul className={styles.subcategories__list}>
                                                <li
                                                    className={styles.subcategoriesBack}
                                                    onClick={() => setActiveCategoryId(0)}
                                                >
                                                    <div className={styles.subcategoriesBack__img} />
                                                    <span className={styles.subcategoriesBack__text}>All categories</span>
                                                </li>
                                                {category.categories.map(subCategory =>
                                                    <li
                                                        key={subCategory.id}
                                                        className={styles.subCategoryItem}
                                                        onClick={() => closeModal()}
                                                    >
                                                        <Link to={CATALOG_ROUTE + '/' + Translit(subCategory.name)} className={styles.subCategoryItem__wrapper}>
                                                            <span className={styles.subCategoryItem__name}>{subCategory.name}</span>
                                                        </Link>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div >
                            }
                        </li>
                    )}
                </ul>
            </div>
        </div >
    );
});

export default CategoryListModal;