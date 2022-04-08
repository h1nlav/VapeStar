import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { IMaskInput } from 'react-imask';
import { Context } from '../../../..';
import styles from './UserChangePersonalInfo.module.css';
import jwt_decode from 'jwt-decode';
import { updateUserInfo } from '../../../../api/userApi';
import AlertsList from '../../../UI/AlertsList/AlertsList';
import ChangeFullInfoField from '../../../UI/ChangeFullInfoField/ChangeFullInfoField';

const UserChangePersonalInfo = observer(({ setIsUserInfoChanging }) => {
    const { auth } = useContext(Context);

    useEffect(() => {
        auth.setName(auth.user.name);
        auth.setSurname(auth.user.surname);
        auth.setEmail(auth.user.email);
        let mobileNum = '+38' + auth.user.mobileNum;
        mobileNum = mobileNum.slice(0, 4) + ' ' + mobileNum.slice(4, 6) + ' '
            + mobileNum.slice(6, 9) + ' ' + mobileNum.slice(9, 11) + ' ' + mobileNum.slice(11, 13);
        auth.setMobileNum(mobileNum);
    }, [auth]);

    const updateUserInfoAndShow = async () => {
        if (auth.nameCheck.length === 0 && auth.surnameCheck.length === 0
            && auth.emailCheck.length === 0 && auth.mobileNumCheck.length === 0) {

            let normalizedMobileNum = auth.mobileNum;
            if (normalizedMobileNum.startsWith('+')) normalizedMobileNum = normalizedMobileNum.split('+').pop();
            if (normalizedMobileNum.startsWith('38')) normalizedMobileNum = normalizedMobileNum.split('38').pop();

            await updateUserInfo({
                id: auth.user.id,
                name: auth.name,
                surname: auth.surname,
                mobileNum: normalizedMobileNum,
                email: auth.email,
            }).then(data => {
                if (data.mobileNum) auth.setMobileNumCheck(data.mobileNum);
                if (data.email) auth.setEmailCheck(data.email);
                if (data.token) {
                    auth.setIsAuth(true);
                    auth.setUser(jwt_decode(data.token));
                    setIsUserInfoChanging(false)
                }
            });
        }
    }

    return (
        <div
            className={styles.changePersonalInfoForm}
            onKeyDown={e => e.key == 'Enter' && updateUserInfoAndShow()}
        >
            <div className={styles.changePersonalInfoForm__fields}>
                <ChangeFullInfoField name={'Name'} value={auth.name} setValue={(value) => auth.setName(value)} checkArray={auth.nameCheck} />
                <ChangeFullInfoField name={'Surname'} value={auth.surname} setValue={(value) => auth.setSurname(value)} checkArray={auth.surnameCheck} />
                <ChangeFullInfoField name={'Email'} value={auth.email} setValue={(value) => auth.setEmail(value)} checkArray={auth.emailCheck} />

                <div className={styles.changePersonalInfoForm__field}>
                    <div className={styles.changePersonalInfoForm__label}><span>Номер телефона</span></div>
                    <IMaskInput
                        mask='+[380] 00 000 00 00'
                        className={styles.changePersonalInfoForm__input}
                        style={auth.mobileNumCheck.length == 0 ? { borderColor: '#a6a5a5' } : { borderColor: '#f84147' }}
                        value={auth.mobileNum || ''}
                        onChange={e => auth.setMobileNum(e.target.value)}
                    />
                    <AlertsList checkArray={auth.mobileNumCheck} />
                </div>
            </div>

            <div className={styles.changePersonalInfoForm__buttons}>
                <button
                    className={
                        (auth.nameCheck.length !== 0 || auth.surnameCheck.length !== 0
                            || auth.emailCheck.length !== 0 || auth.mobileNumCheck.length !== 0)
                            ? `${styles.changePersonalInfoForm__saveButton} ${styles.changePersonalInfoForm__saveButtonNotActive}`
                            : styles.changePersonalInfoForm__saveButton
                    }
                    onClick={() => updateUserInfoAndShow()}
                >
                    Save
                </button>
                <button
                    className={styles.changePersonalInfoForm__cancelButton}
                    onClick={() => setIsUserInfoChanging(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
});

export default UserChangePersonalInfo;