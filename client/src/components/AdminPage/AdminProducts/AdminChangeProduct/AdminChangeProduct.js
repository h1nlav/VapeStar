import React, { useEffect, useRef, useState } from 'react';
import { createProduct, updateProduct } from '../../../../api/productApi';
import styles from './AdminChangeProduct.module.css';

const AdminChangeProduct = ({ product, categories, fetchAndShowProducts, setIsProductChanging, isCreating = false }) => {
    const [productNameValue, setProductNameValue] = useState(product.name);
    const [productCategoryValue, setProductCategoryValue] = useState(product.categoryId || 0);
    const [productDescriptionValue, setProductDescriptionValue] = useState(product.description);
    const [productPriceValue, setProductPriceValue] = useState(product.price);
    const [productIsAvailableValue, setProductIsAvailableValue] = useState(product.isAvailable);
    const [productInfoValues, setProductInfoValues] = useState([]);
    const [productOldPics, setProductOldPics] = useState(product.products_pics);
    const [productNewPics, setProductNewPics] = useState([]);
    const inputImg = useRef(null);

    useEffect(() => {
        let categoryFilters = [];
        categories.filter(ctg => {
            if (ctg.id === parseInt(productCategoryValue))
                ctg.filters && ctg.filters.map(filter => categoryFilters.push(filter[1]))
        })

        let infoArray = [];
        categoryFilters.map(filterName => {
            let isExist = false;
            product.info.map(info => {
                if (info[0] === filterName) {
                    infoArray.push([filterName, info[1], true]);
                    isExist = true;
                }
            });
            if (!isExist) infoArray.push([filterName, '', true]);
        });

        product.info.map(info => {
            let isExist = false;
            infoArray.map(existValue => {
                if (info[0] === existValue[0]) {
                    existValue[1] = info[1];
                    isExist = true;
                }
            });
            if (!isExist) infoArray.push([info[0], info[1], false]);
        });

        productInfoValues.map(info => {
            let isExist = false;
            infoArray.map(existValue => {
                if (info[0] === existValue[0]) {
                    existValue[1] = info[1];
                    isExist = true;
                }
            });
            if (!isExist) infoArray.push([info[0], info[1], false]);
        });

        setProductInfoValues(infoArray)
    }, [productCategoryValue]);


    const changeAndShowProduct = async () => {
        let checkInfo = true;
        productInfoValues.map(info => {
            if (info[0] === '' || info[1] === '') checkInfo = false
        });

        if (productNameValue !== ''
            && productCategoryValue !== 0
            && productDescriptionValue !== ''
            && parseInt(productPriceValue) > 0
            && checkInfo
            && productOldPics.length + productNewPics.length !== 0) {
            let formData = new FormData();
            formData.append('id', product.id);
            formData.append('categoryId', productCategoryValue);
            formData.append('name', productNameValue);
            formData.append('description', productDescriptionValue);
            formData.append('price', productPriceValue);
            formData.append('isAvailable', productIsAvailableValue);
            formData.append('info', JSON.stringify(productInfoValues));
            formData.append('oldPics', JSON.stringify(productOldPics));

            if (isCreating) {
                productNewPics.map(newPic => formData.append('img', newPic));

                await createProduct(formData)
                    .then(async () => {
                        setIsProductChanging(false)
                        await fetchAndShowProducts();
                    });
            }
            else {
                productNewPics.map(newPic => formData.append('newPics', newPic));
                await updateProduct(formData)
                    .then(async () => {
                        setIsProductChanging(false)
                        await fetchAndShowProducts();
                    });
            }

        }
    }

    return (
        <div className={styles.changeProductForm}>
            <div className={styles.changeProductForm__field}>
                <div className={styles.changeProductForm__label}><span>Product name</span></div>
                <input
                    className={styles.changeProductForm__input}
                    value={productNameValue}
                    onChange={e => setProductNameValue(e.target.value)}
                />
            </div>


            <div className={styles.changeProductForm__field}>
                <div className={styles.changeProductForm__label}><span>Catygory</span></div>
                <select
                    className={styles.changeProductForm__select}
                    value={productCategoryValue}
                    onInput={e => setProductCategoryValue(e.target.value)}
                >
                    <option value={0}></option>
                    {categories && categories.map(category =>
                        <option key={category.id} value={category.id}>{category.name}</option>
                    )}
                </select>
            </div>

            <div className={styles.changeProductForm__field}>
                <div className={styles.changeProductForm__label}><span>Product description</span></div>
                <textarea
                    className={styles.changeProductForm__textarea}
                    value={productDescriptionValue}
                    onChange={e => setProductDescriptionValue(e.target.value)}
                />
            </div>

            <div className={styles.changeProductForm__field}>
                <div className={styles.changeProductForm__label}><span>Product price</span></div>
                <div className={styles.changeProductForm__price}>
                    <input
                        type='number'
                        className={styles.changeProductForm__input}
                        value={productPriceValue}
                        onKeyDown={e => ['+', '-', 'e'].includes(e.key) && e.preventDefault()}
                        onChange={e => setProductPriceValue(e.target.value)}
                    />
                    <span>$.</span>
                </div>
            </div>

            <div className={styles.changeProductForm__field}>
                <div className={styles.changeProductForm__label}><span>Product availability</span></div>
                <select
                    className={styles.changeProductForm__select}
                    value={productIsAvailableValue}
                    onInput={e => setProductIsAvailableValue(e.target.value)}
                >
                    {[[true, 'In stock'], [false, 'Out of stock']].map(option =>
                        <option key={option[0]} value={option[0]}>{option[1]}</option>
                    )}
                </select>
            </div>

            <div className={styles.changeProductForm__field}>
                <div className={styles.changeProductForm__label}><span>Product information</span></div>
                {productInfoValues.map((info, index) =>
                    <div key={index} className={styles.changeProductForm__info}>
                        {info && info[2] && info[2] === true
                            ? <div className={styles.changeProductForm__infoName}><span>{info[0]}:</span></div>
                            : <div className={styles.changeProductForm__infoName}>
                                <input
                                    className={styles.changeProductForm__input}
                                    value={info[0]}
                                    onChange={e => {
                                        let tmpArray = [...productInfoValues];
                                        tmpArray[index][0] = e.target.value
                                        setProductInfoValues(tmpArray);
                                    }}
                                />
                                <span>:</span>
                            </div>
                        }
                        <input
                            className={styles.changeProductForm__input}
                            value={info[1]}
                            onChange={e => {
                                let tmpArray = [...productInfoValues];
                                tmpArray[index][1] = e.target.value
                                setProductInfoValues(tmpArray);
                            }}
                        />

                        {info[2] == false &&
                            <div
                                className={styles.changeProductForm__removeInfo}
                                onClick={() => {
                                    let tmpArray = [...productInfoValues];
                                    setProductInfoValues(tmpArray.filter((el, indexValue) => indexValue !== index))
                                }}
                            >
                                <div />
                            </div>
                        }
                    </div>
                )}
                <div
                    className={styles.changeProductForm__addInfo}
                    onClick={() => setProductInfoValues([...productInfoValues, ['', '', false]])}
                >
                    <span>Add information</span>
                </div>
            </div>

            <div className={styles.changeProductForm__field}>
                <div className={styles.changeProductForm__label}><span>Product pictures</span></div>
                <div className={styles.changeProductForm__pics}>
                    {productOldPics.map((pic, index) =>
                        <div key={index} className={styles.changeProductForm__picWrapper}>
                            <a href={process.env.REACT_APP_API_URL + '/img/' + pic.fileName} target="_blank">
                                <div className={styles.changeProductForm__pic}>
                                    <img src={process.env.REACT_APP_API_URL + '/img/' + pic.fileName} />
                                </div>
                            </a>
                            <div
                                className={styles.changeProductForm__removePic}
                                onClick={() => {
                                    let tmpArray = [...productOldPics];
                                    setProductOldPics(tmpArray.filter((el, indexValue) => indexValue !== index))
                                }}
                            >
                                <div />
                            </div>
                        </div>
                    )}

                    {productNewPics.map((pic, index) =>
                        <div key={index} className={styles.changeProductForm__picWrapper}>
                            <a href={URL.createObjectURL(pic)} target="_blank">
                                <div className={styles.changeProductForm__pic}>
                                    <img src={URL.createObjectURL(pic)} />
                                </div>
                            </a>
                            <div
                                className={styles.changeProductForm__removePic}
                                onClick={() => {
                                    let tmpArray = [...productNewPics];
                                    setProductNewPics(tmpArray.filter((el, indexValue) => indexValue !== index))
                                }}
                            >
                                <div />
                            </div>
                        </div>
                    )}
                </div>

                <div
                    className={styles.changeProductForm__addInfo}
                    onClick={() => {
                        inputImg.current.click();
                    }}
                >
                    <input
                        ref={inputImg}
                        type="file"
                        accept="image/png, image/jpeg"
                        multiple
                        style={{ display: 'none' }}
                        onChange={e => {
                            setProductNewPics([...productNewPics, ...e.target.files]);
                            e.target.value = '';
                        }} />
                    <span>Add new picture</span>
                </div>
            </div>

            <div className={styles.changeProductForm__buttons}>
                <button
                    className={function () {
                        let checkInfo = true;
                        productInfoValues.map(info => {
                            if (info[0] === '' || info[1] === '') checkInfo = false
                        })
                        if (productNameValue == '' || productCategoryValue == 0 || productDescriptionValue == ''
                            || productPriceValue <= 0 || !checkInfo
                            || (productOldPics.length == 0 && productNewPics.length == 0)) {
                            return `${styles.changeProductForm__saveButton} ${styles.changeProductForm__saveButtonNotActive}`
                        } else {
                            return styles.changeProductForm__saveButton;
                        }
                    }()}
                    onClick={() => changeAndShowProduct()}
                >
                    Save
                </button>
                <button
                    className={styles.changeProductForm__cancelButton}
                    onClick={() => setIsProductChanging(false)}
                >
                    Cancel
                </button>
            </div>
        </div >
    );
};

export default AdminChangeProduct;