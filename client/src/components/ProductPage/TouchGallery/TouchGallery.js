import React, { useRef, useState } from 'react';
import styles from './TouchGallery.module.css';

const TouchGallery = ({ pics }) => {

    const canvas = useRef();
    const [showPic, setShowPic] = useState(1);
    const [touchStart, setTouchStart] = useState(-1);
    const [touchMove, setTouchMove] = useState(-1);

    const getEventPosition = (e) => {
        return e.touches[0].clientX
    }

    const changeShowPic = () => {
        if (touchMove !== -1) {
            if (touchMove - 10 > touchStart && showPic - 1 > 0) setShowPic(showPic - 1);
            else if (touchMove + 10 < touchStart && showPic + 1 <= pics.length) setShowPic(showPic + 1);
        }
    }

    const countTransition = () => {
        const canvasWidth = canvas.current ? canvas.current.offsetWidth : null;
        const offset = -((showPic - 1) * 100)
        if (pics.length === 1) return '0%';
        else if (touchStart === -1 || touchMove === -1) return `${offset}%`;
        else if (canvasWidth && showPic === 1 && -(touchStart - touchMove) > canvasWidth / 10 * 4) return `calc(${offset}% + 40%)`;
        else if (canvasWidth && showPic === pics.length && -(touchStart - touchMove) < canvasWidth / 10 * 4) return `calc(${offset}% - 40%)`;
        else return `calc(${offset}% - ${(touchStart - touchMove)}px`;
    }

    return (
        <div className={styles.touchGallery}>
            <div className={styles.touchGallery__wrapper}>
                <div
                    ref={canvas}
                    className={styles.touchGallery__canvas}
                >
                    {pics.length > 1 &&
                        <div
                            className={`${styles.touchGallery__backButton} ${showPic === 1 && styles.touchGallery__buttonNotActive}`}
                            onClick={() => showPic - 1 > 0 && setShowPic(showPic - 1)}
                        ><div /></div>
                    }
                    <div
                        className={styles.touchGallery__pics}
                        onTouchStart={e => setTouchStart(getEventPosition(e))}
                        onTouchMove={e => setTouchMove(getEventPosition(e))}
                        onTouchEnd={() => {
                            changeShowPic();
                            setTouchStart(-1);
                            setTouchMove(-1);
                        }}
                        style={{ transform: `translateX(${countTransition()})` }}
                    >
                        {pics.map((item) =>
                            <div
                                key={item.fileName}
                                className={styles.touchGallery__pic}
                            >
                                <img src={process.env.REACT_APP_API_URL + '/img/' + item.fileName}></img>
                            </div>
                        )}
                    </div>
                    {pics.length > 1 &&
                        <div
                            className={`${styles.touchGallery__forwardButton} ${showPic === pics.length && styles.touchGallery__buttonNotActive}`}
                            onClick={() => showPic + 1 <= pics.length && setShowPic(showPic + 1)}
                        ><div /></div>
                    }
                </div>

                {pics.length > 1 &&
                    <div className={styles.dots}>
                        {pics.length > 1 && pics.map((item, index) =>
                            <div
                                key={item.fileName}
                                className={styles.dots__itemContainer}
                                onClick={() => setShowPic(index + 1)}
                            >
                                <div className={showPic === index + 1 ? styles.dots__selectedItem : styles.dots__item} />
                            </div>
                        )}
                    </div>
                }
            </div>
        </div >
    );
};

export default TouchGallery;