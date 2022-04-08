import React, { useState } from 'react';
import { deleteCategory } from '../../../../api/categoryApi';
import AdminAddCategory from '../AdminAddCategory/AdminAddCategory';
import AdminChangeCategory from '../AdminChangeCategory/AdminChangeCategory';
import ConfirmationModal from '../../../UI/ConfirmationModal/ConfirmationModal';
import styles from './AdminCategory.module.css'
import ShortInfoContainer from '../../../UI/ShortInfoContainer/ShortInfoContainer';

const AdminCategory = ({ category, fetchAndShowCategories, isMainCategory }) => {
    const [isCategoryOpened, setIsCategoryOpened] = useState(false);
    const [isCategoryChanging, setIsCategoryChanging] = useState(false);

    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [confirmationModalMessage, setConfirmationModalMessage] = useState('');
    const [confirmationModalCallback, setConfirmationModalCallback] = useState(null);

    const removeAndShowCategory = async (id) => {
        await deleteCategory({ id })
            .then(async () => await fetchAndShowCategories());
    }

    return (
        <li className={styles.category}>
            <ShortInfoContainer
                id={`№ ${category.id}`}
                isOpened={isCategoryOpened}
                onClick={() => setIsCategoryOpened(!isCategoryOpened)}
            >
                <div className={styles.shortInfo__name}>{category.name}</div>
                {isMainCategory &&
                    <div className={styles.shortInfo__subCtgQuantity}>{category.categories.length}</div>
                }
            </ShortInfoContainer>

            {isCategoryOpened &&
                <div>
                    <div className={styles.category__opened}>
                        {isCategoryChanging
                            ?
                            <AdminChangeCategory
                                category={category}
                                fetchAndShowCategories={fetchAndShowCategories}
                                isCategoryChanging={isCategoryChanging}
                                setIsCategoryChanging={setIsCategoryChanging}
                            />
                            :
                            <div className={styles.fullInfo}>
                                <div className={styles.fullInfo__field}>
                                    <div className={styles.fullInfo__label}><span>Category name</span></div>
                                    <span className={styles.fullInfo__value}>{category.name}</span>
                                </div>

                                {category.filters.length !== 0 &&
                                    <div className={styles.fullInfo__field}>
                                        <div className={styles.fullInfo__label}><span>Category filters</span></div>
                                        {category.filters.map((filter, index) =>
                                            <span key={index} className={styles.fullInfo__value}>{filter}</span>
                                        )}
                                    </div>
                                }

                                <div className={styles.fullInfo__buttons}>
                                    <button
                                        className={styles.fullInfo__removeButton}
                                        onClick={() => {
                                            if (category.categories.length === 0)
                                                setConfirmationModalMessage(<span>Are you sure you want to delete the "{category.name}" category?</span>);
                                            else {
                                                setConfirmationModalMessage(
                                                    <span>
                                                        <span>Are you sure you want to delete the "{category.name}" category?</span><br /><br />
                                                        <span>The following subcategories will be removed along with it:</span><br />
                                                        {category.categories.map((el, index) => <span key={index}>- {el.name}<br /></span>)}
                                                    </span>
                                                );
                                            }
                                            setConfirmationModalCallback(() => () => removeAndShowCategory(category.id))
                                            setIsConfirmationModalVisible(true);
                                        }}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className={styles.fullInfo__editButton}
                                        onClick={() => setIsCategoryChanging(!isCategoryChanging)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                    <ul className={styles.subcategories}>
                        {category.categories.map(subcategory =>
                            <AdminCategory
                                key={subcategory.id}
                                category={subcategory}
                                fetchAndShowCategories={fetchAndShowCategories}
                                isMainCategory={false}
                            />
                        )}

                        {isMainCategory &&
                            <AdminAddCategory
                                fetchAndShowCategories={fetchAndShowCategories}
                                parentCategoryId={category.id}
                            />
                        }
                    </ul>

                </div>
            }
            <ConfirmationModal
                isVisible={isConfirmationModalVisible}
                setIsVisible={setIsConfirmationModalVisible}
                message={confirmationModalMessage}
                callback={confirmationModalCallback}
            />
        </li >
    );
};

export default AdminCategory;