import React, { useEffect, useRef, useState } from 'react';
import { BodyScrollOff, BodyScrollOn } from '../../../utils/changeBodyScroll';
import GalleryModal from '../../Modals/GalleryModal/GalleryModal';
import styles from './Gallery.module.css';

const Picture_LENGTH = 20;
const TRANSITION_DURATION = 200;

const Gallery = ({ pics, productName }) => {
    const [mainImg, setMainImg] = useState(pics[0].fileName)
    const mainImgEl = useRef(null);
    const mainImgElBack = useRef(null);

    useEffect(() => {
        setMainImg(pics[0].fileName);
        if (mainImgEl.current) mainImgEl.current.src = process.env.REACT_APP_API_URL + '/img/' + pics[0].fileName;
        if (mainImgElBack.current) mainImgElBack.current.src = process.env.REACT_APP_API_URL + '/img/' + pics[0].fileName;
    }, [pics]);

    const changeMainImg = (img) => {
        let isUnmount = false;
        setMainImg(img);
        mainImgEl.current.style.opacity = '0';
        setTimeout(() => {
            if (!isUnmount) {
                mainImgEl.current.src = process.env.REACT_APP_API_URL + '/img/' + img;
                mainImgEl.current.style = 'none';
            }
        }, 100);
        return () => { isUnmount = true };
    }

    const [finalPics, setFinalPics] = useState([]);
    useEffect(() => setFinalPics([...pics, ...pics, ...pics,]), [pics]);

    const [offset, setOffset] = useState(-pics.length * Picture_LENGTH);
    const [transitionDuration, setTransitionDuration] = useState(TRANSITION_DURATION);
    const [isButtonsBlocked, setIsButtonsBlocked] = useState(false)
    useEffect(() => {
        let isUnmount = false;
        if (offset === 0) {
            setTransitionDuration(0);
            setTimeout(async () => {
                if (!isUnmount) {
                    setOffset(offset - pics.length * Picture_LENGTH);
                    setTimeout(async () => setTransitionDuration(TRANSITION_DURATION), 100);
                }
            }, TRANSITION_DURATION);
        } else if (offset === -(pics.length * 2 * Picture_LENGTH)) {
            setTransitionDuration(0);
            setTimeout(async () => {
                if (!isUnmount) {
                    setOffset(offset + pics.length * Picture_LENGTH);
                    setTimeout(async () => setTransitionDuration(TRANSITION_DURATION), 100);
                }
            }, TRANSITION_DURATION);
        }
        return () => { isUnmount = true };
    }, [offset]);

    const [isGalleryModalVisible, setIsGalleryModalVisible] = useState(false)
    useEffect(() => isGalleryModalVisible === false ? BodyScrollOn() : BodyScrollOff(), [isGalleryModalVisible]);

    return (
        <div className={styles.gallery}>
            {finalPics.length > 0 &&
                <div
                    className={styles.gallery__mainImg}
                    onClick={() => setIsGalleryModalVisible(true)}
                >
                    <img ref={mainImgElBack} src={process.env.REACT_APP_API_URL + '/img/' + mainImg}></img>
                    <img ref={mainImgEl} src={process.env.REACT_APP_API_URL + '/img/' + pics[0].fileName}></img>
                </div>
            }

            {pics.length >= 100 / Picture_LENGTH
                ? (
                    <div className={styles.gallery_picsList}>
                        <div
                            className={styles.gallery__button}
                            onClick={() => {
                                if (!isButtonsBlocked) {
                                    setIsButtonsBlocked(true);
                                    setOffset(offset + Picture_LENGTH);
                                    setTimeout(() => setIsButtonsBlocked(false), TRANSITION_DURATION + 200);
                                }
                            }}
                        />

                        <div className={styles.picsList}>
                            <div className={styles.picsList_allItems}
                                style={{
                                    transitionDuration: `${transitionDuration}ms`,
                                    transform: `translateX(${offset}%)`,
                                }}>
                                {finalPics.length > 0 && finalPics.map((item, index) =>
                                    <div
                                        key={index}
                                        className={item.fileName == mainImg
                                            ? `${styles.picsList__item} ${styles.picsList__selectedItem}`
                                            : styles.picsList__item
                                        }
                                        onClick={() => changeMainImg(item.fileName)}
                                    >
                                        <img src={process.env.REACT_APP_API_URL + '/img/' + item.fileName}></img>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div
                            className={styles.gallery__button}
                            onClick={() => {
                                if (!isButtonsBlocked) {
                                    setIsButtonsBlocked(true);
                                    setOffset(offset - Picture_LENGTH);
                                    setTimeout(() => setIsButtonsBlocked(false), TRANSITION_DURATION + 200);
                                }
                            }}
                        />
                    </div>
                ) : (
                    <div className={styles.gallery_picsList}>
                        <div className={`${styles.gallery__button} ${styles.gallery__buttonNotActive}`} />
                        <div className={styles.picsList}>
                            <div className={styles.picsList_allItemsCenter}>
                                {pics.length > 0 && pics.map((item, index) =>
                                    <div
                                        key={index}
                                        className={item.fileName == mainImg
                                            ? `${styles.picsList__item} ${styles.picsList__selectedItem}`
                                            : styles.picsList__item
                                        }
                                        onClick={() => changeMainImg(item.fileName)}
                                    >

                                        <img src={process.env.REACT_APP_API_URL + '/img/' + item.fileName}></img>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={`${styles.gallery__button} ${styles.gallery__buttonNotActive}`} />
                    </div>
                )
            }
            <GalleryModal isVisible={isGalleryModalVisible} closeModal={() => setIsGalleryModalVisible(false)} productName={productName} pics={pics} mainImg={mainImg} />
        </div >
    );
};

export default Gallery;
