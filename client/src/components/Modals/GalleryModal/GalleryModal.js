import React, { useEffect, useState } from 'react';
import ModalName from '../../UI/ModalName/ModalName';
import styles from './GalleryModal.module.css'

const GalleryModal = ({ isVisible, closeModal, pics, mainImg, productName }) => {
    const [isBgDown, setIsBgDown] = useState(false);

    const [selectedPic, setSelectedPic] = useState(null);
    useEffect(() => {
        if (mainImg) {
            let index = pics.map(function (item) { return item.fileName; }).indexOf(mainImg);
            setSelectedPic(index);
        }
    }, [mainImg]);

    const [offset, setOffset] = useState(null);
    const [leftButtonVisible, setLeftButtonVisible] = useState(true);
    const [rightButtonVisible, setRightButtonVisible] = useState(true);
    useEffect(() => {
        if (selectedPic !== null) {
            setOffset(-selectedPic * 100);
            if (selectedPic === 0) setLeftButtonVisible(false);
            else setLeftButtonVisible(true);
            if (selectedPic === (pics.length - 1)) setRightButtonVisible(false);
            else setRightButtonVisible(true);
        }
    }, [selectedPic])

    if (!isVisible) return (<div></div>)
    return (
        <div id='bg' className={styles.modal}
            onMouseDown={e => e.target.id == 'bg' && setIsBgDown(true)}
            onMouseUp={e => {
                if (e.target.id == 'bg' && isBgDown) closeModal();
                setIsBgDown(false)
            }}
        >
            <div className={styles.modal__content}>
                <ModalName modalName={`${productName}`} callback={() => closeModal()} />

                <div className={styles.pics}>
                    <div className={styles.picsList}>
                        <div
                            className={leftButtonVisible ? styles.picsList__button : `${styles.picsList__button} ${styles.picsList__buttonNotActive}`}
                            onClick={() => { if (leftButtonVisible) setSelectedPic(selectedPic - 1) }}
                        >
                            <div
                                className={styles.picsList__leftArrow}
                            />
                        </div>

                        <div className={styles.picsList__content} >
                            <div className={styles.picsList_allItems}
                                style={{ transform: `translateX(${offset}%)` }}
                            >

                                {pics.length > 0 && pics.map(item =>
                                    <div key={item.fileName} className={styles.picsList__item}>
                                        <img src={process.env.REACT_APP_API_URL + '/img/' + item.fileName}></img>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div
                            className={rightButtonVisible ? styles.picsList__button : `${styles.picsList__button} ${styles.picsList__buttonNotActive}`}
                            onClick={() => { if (rightButtonVisible) setSelectedPic(selectedPic + 1) }}
                        >
                            <div
                                className={styles.picsList__rightArrow}
                            />
                        </div>
                    </div>
                    <div className={styles.dots}>
                        {pics.length > 0 && pics.map((item, index) =>
                            <div
                                key={item.fileName}
                                className={styles.dots__itemContainer}
                                onClick={() => setSelectedPic(index)}
                            >
                                <div className={(pics[selectedPic] && item.fileName === pics[selectedPic].fileName) ? styles.dots__selectedItem : styles.dots__item}></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GalleryModal;