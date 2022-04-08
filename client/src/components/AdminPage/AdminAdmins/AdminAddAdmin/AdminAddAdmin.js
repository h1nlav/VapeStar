import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { IMaskInput } from 'react-imask';
import { registration } from '../../../../api/userApi';
import AlertsList from '../../../UI/AlertsList/AlertsList';
import ChangeFullInfoField from '../../../UI/ChangeFullInfoField/ChangeFullInfoField';
import styles from './AdminAddAdmin.module.css';

const AdminAddAdmin = observer(({ newAdmin, fetchAndShowAdmins }) => {
    const [isNewAdminCreating, setIsNewAdminCreating] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    useEffect(() => newAdmin.resetAuthStore(), [isNewAdminCreating]);

    const AddAdminAndShow = async () => {
        if (!newAdmin.name) newAdmin.setName('');
        if (!newAdmin.surname) newAdmin.setSurname('');
        if (!newAdmin.mobileNum) newAdmin.setMobileNum('');
        if (!newAdmin.email) newAdmin.setEmail('');
        if (!newAdmin.regPassword) newAdmin.setRegPassword('');

        if (newAdmin.nameCheck.length === 0 && newAdmin.surnameCheck.length === 0 && newAdmin.emailCheck.length === 0
            && newAdmin.mobileNumCheck.length === 0 && newAdmin.regPasswordCheck.length === 0) {

            let normalizedMobileNum = newAdmin.mobileNum;
            if (normalizedMobileNum.startsWith('+')) normalizedMobileNum = normalizedMobileNum.split('+').pop();
            if (normalizedMobileNum.startsWith('38')) normalizedMobileNum = normalizedMobileNum.split('38').pop();

            await registration({
                name: newAdmin.name,
                surname: newAdmin.surname,
                mobileNum: normalizedMobileNum,
                email: newAdmin.email,
                password: newAdmin.regPassword,
                role: 'ADMIN',
            }, true).then(async (data) => {
                if (data.mobileNum) newAdmin.setMobileNumCheck(data.mobileNum);
                if (data.email) newAdmin.setEmailCheck(data.email);
                if (data.confirmation) {
                    setIsNewAdminCreating(false);
                    await fetchAndShowAdmins();
                }
            });
        }
    }

    return (
        <div>
            {isNewAdminCreating
                ?
                <div className={styles.addAdminForm}>
                    <div className={styles.addAdminForm__fields}>
                        <ChangeFullInfoField name={'Name'} value={newAdmin.name} setValue={(value) => newAdmin.setName(value)} checkArray={newAdmin.nameCheck} />
                        <ChangeFullInfoField name={'Surname'} value={newAdmin.surname} setValue={(value) => newAdmin.setSurname(value)} checkArray={newAdmin.surnameCheck} />

                        <div className={styles.addAdminForm__field}>
                            <div className={styles.addAdminForm__label}><span>Phone number</span></div>
                            <IMaskInput
                                mask='+[380] 00 000 00 00'
                                className={styles.addAdminForm__input}
                                style={newAdmin.mobileNumCheck.length == 0 ? { borderColor: '#a6a5a5' } : { borderColor: '#f84147' }}
                                value={newAdmin.mobileNum || ''}
                                onChange={e => newAdmin.setMobileNum(e.target.value)}
                            />
                            <AlertsList checkArray={newAdmin.mobileNumCheck} />
                        </div>

                        <ChangeFullInfoField name={'Email'} value={newAdmin.email} setValue={(value) => newAdmin.setEmail(value)} checkArray={newAdmin.emailCheck} />

                        <div className={styles.addAdminForm__field}>
                            <div className={styles.addAdminForm__label}><span>Password</span></div>
                            <div className={styles.addAdminForm__passwordWrapper}>
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'} className={`${styles.addAdminForm__input} ${styles.addAdminForm__passwordInput}`}
                                    style={newAdmin.regPasswordCheck.length == 0 ? { borderColor: '#797878' } : { borderColor: '#f84147' }}
                                    onChange={e => newAdmin.setRegPassword(e.target.value)}
                                />
                                <div
                                    className={isPasswordVisible
                                        ? `${styles.password_img} ${styles.password_visibleImg}`
                                        : styles.password_img}
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    style={newAdmin.regPasswordCheck.length == 0 ? { borderColor: '#797878' } : { borderColor: '#f84147' }}
                                ><div></div></div>
                            </div>
                            <AlertsList checkArray={newAdmin.regPasswordCheck} />
                        </div>
                    </div>

                    <div className={styles.addAdminForm__buttons}>
                        <button
                            className={
                                (newAdmin.nameCheck.length !== 0 || newAdmin.surnameCheck.length !== 0 || newAdmin.emailCheck.length !== 0
                                    || newAdmin.mobileNumCheck.length !== 0 || newAdmin.regPasswordCheck.length !== 0)
                                    ? `${styles.addAdminForm__saveButton} ${styles.addAdminForm__saveButtonNotActive}`
                                    : styles.addAdminForm__saveButton
                            }
                            onClick={() => AddAdminAndShow()}
                        >
                            Save
                        </button>
                        <button
                            className={styles.addAdminForm__cancelButton}
                            onClick={() => setIsNewAdminCreating(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
                :
                <div
                    className={styles.addAdminForm_addAdminButton}
                    onClick={() => setIsNewAdminCreating(true)}
                >
                    <span>Add administrator</span>
                </div>
            }
        </div>
    );
});

export default AdminAddAdmin;