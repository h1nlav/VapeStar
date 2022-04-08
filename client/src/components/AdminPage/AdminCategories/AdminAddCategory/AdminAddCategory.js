import React, { useState } from 'react';
import { createCategory } from '../../../../api/categoryApi';
import styles from './AdminAddCategory.module.css';

const AdminAddCategory = ({ fetchAndShowCategories, parentCategoryId = null }) => {
    const [isNewCategoryCreating, setIsNewCategoryCreating] = useState(false);
    const [newCategoryNameValue, setNewCategoryNameValue] = useState('');

    const createAndShowCategory = async () => {
        await createCategory({
            name: newCategoryNameValue,
            parentCategoryId: parentCategoryId,
        }).then(async () => {
            await fetchAndShowCategories();
            setNewCategoryNameValue('');
            setIsNewCategoryCreating(false);
        })
    }

    return (
        <div>
            {isNewCategoryCreating
                ?
                <div className={styles.addCategoryForm}>
                    <div className={styles.addCategoryForm__field}>
                        <div className={styles.addCategoryForm__label}>
                            <span>{parentCategoryId ? 'Category name' : 'Subcategory name'}</span>
                        </div>
                        <input
                            className={styles.addCategoryForm__input}
                            value={newCategoryNameValue}
                            onChange={e => setNewCategoryNameValue(e.target.value)}
                        />
                    </div>

                    <div className={styles.addCategoryForm__buttons}>
                        <button
                            className={newCategoryNameValue.length === 0
                                ? `${styles.addCategoryForm__saveButton} ${styles.addCategoryForm__saveButtonNotActive}`
                                : styles.addCategoryForm__saveButton
                            }
                            onClick={() => newCategoryNameValue.length !== 0 && createAndShowCategory()}
                        >
                            Save
                        </button>
                        <button
                            className={styles.addCategoryForm__cancelButton}
                            onClick={() => {
                                setNewCategoryNameValue('');
                                setIsNewCategoryCreating(false);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
                :
                <div
                    className={styles.addCategoryForm_addCategoryButton}
                    onClick={() => setIsNewCategoryCreating(true)}
                >
                    <span>{parentCategoryId ? 'Add subcategory' : 'Add category'}</span>
                </div>
            }
        </div>
    );
};

export default AdminAddCategory;