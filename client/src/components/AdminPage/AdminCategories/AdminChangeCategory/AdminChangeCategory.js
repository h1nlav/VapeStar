import React, { useState } from 'react';
import { updateCategory } from '../../../../api/categoryApi';
import styles from './AdminChangeCategory.module.css'

const AdminChangeCategory = ({ category, fetchAndShowCategories, isCategoryChanging, setIsCategoryChanging }) => {
    const [categoryNameValue, setCategoryNameValue] = useState(category.name);
    const [categoryFilters, setCategoryFilters] = useState(category.filters);


    const changeAndShowCategory = async () => {
        await updateCategory({ id: category.id, name: categoryNameValue, filters: categoryFilters })
            .then(async () => {
                await fetchAndShowCategories()
                    .then(() => setIsCategoryChanging(!isCategoryChanging))
            })
    }


    return (
        <div className={styles.changeCategoryForm}>
            <div className={styles.changeCategoryForm__field}>
                <div className={styles.changeCategoryForm__label}><span>Category name</span></div>
                <input
                    className={styles.changeCategoryForm__input}
                    value={categoryNameValue}
                    onChange={e => setCategoryNameValue(e.target.value)}
                />
            </div>

            <div>
                {categoryFilters.length !== 0 &&
                    <ul>
                        <div className={styles.changeCategoryForm__label}><span>Category filters</span></div>
                        {categoryFilters.map((filter, index) =>
                            <li key={index} className={styles.filterContainer}>
                                <input
                                    className={styles.changeCategoryForm__input}
                                    value={categoryFilters[index]}
                                    onChange={e => {
                                        let tmpArray = [...categoryFilters];
                                        tmpArray[index] = e.target.value;
                                        setCategoryFilters(tmpArray);
                                    }}
                                />
                                <div
                                    className={styles.filterContainer__removeFilter}
                                    onClick={() => {
                                        let tmpArray = [...categoryFilters];
                                        setCategoryFilters(tmpArray.filter(el => el !== filter))
                                    }}
                                >
                                    <div />
                                </div>
                            </li>
                        )}
                    </ul>
                }

                {category.categories.length === 0 &&
                    <div
                        className={styles.changeCategoryForm__addFilter}
                        onClick={() => setCategoryFilters([...categoryFilters, ''])}
                    >
                        <span>Add filter</span>
                    </div>
                }
            </div>

            <div className={styles.changeCategoryForm__buttons}>
                <button
                    className={(categoryFilters.indexOf('') !== -1 || categoryNameValue.length === 0)
                        ? `${styles.changeCategoryForm__saveButton} ${styles.changeCategoryForm__saveButtonNotActive}`
                        : styles.changeCategoryForm__saveButton
                    }
                    onClick={() => (categoryFilters.indexOf('') === -1 && categoryNameValue.length !== 0)
                        && changeAndShowCategory()}
                >
                    Save
                </button>
                <button
                    className={styles.changeCategoryForm__cancelButton}
                    onClick={() => setIsCategoryChanging(!isCategoryChanging)}
                >
                    Cancel
                </button>
            </div>
        </div >
    )
};

export default AdminChangeCategory;