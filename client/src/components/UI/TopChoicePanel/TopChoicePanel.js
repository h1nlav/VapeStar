import React from 'react';
import styles from './TopChoicePanel.module.css';

const TopChoicePanel = ({ options, selectedOption, setSelectedOption }) => {
    return (
        <ul className={`${styles.topPanel__navigation} unselectable`}>
            <li style={{ width: '100%', borderBottom: '1px solid #e9e9e9' }} />

            {options.map((option, index) =>
                <li
                    key={index}
                    className={option == selectedOption
                        ? `${styles.topPanel__option} ${styles.topPanel__chosenOption}`
                        : styles.topPanel__option}
                    onClick={(e) => setSelectedOption(option)}
                >
                    <span>{option}</span>
                </li>
            )}

            <li style={{ width: '100%', borderBottom: '1px solid #e9e9e9' }} />
        </ul >
    );
};

export default TopChoicePanel;