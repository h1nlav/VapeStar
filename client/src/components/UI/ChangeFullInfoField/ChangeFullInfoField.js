import { observer } from 'mobx-react-lite';
import React from 'react';
import AlertsList from '../AlertsList/AlertsList';
import styles from './ChangeFullInfoField.module.css'

const ChangeFullInfoField = observer(({ name, value, setValue, checkArray }) => {
    return (
        <div className={styles.changeFullInfoField}>
            <div className={styles.changeFullInfoField__label}>{name}</div>
            <input
                className={styles.changeFullInfoField__input}
                style={checkArray.length == 0 ? { borderColor: '#a6a5a5' } : { borderColor: '#f84147' }}
                value={value || ''}
                onChange={e => setValue(e.target.value)}
            />
            <AlertsList checkArray={checkArray} />
        </div>
    );
});

export default ChangeFullInfoField;