import { observer } from 'mobx-react-lite';
import React from 'react';
import { IMaskInput } from 'react-imask';
import { updateUserInfo } from '../../../../api/userApi';
import AlertsList from '../../../UI/AlertsList/AlertsList';
import ChangeFullInfoField from '../../../UI/ChangeFullInfoField/ChangeFullInfoField';
import styles from './AdminChangeAdmin.module.css';

const AdminChangeAdmin = observer(({ admin, adminInfo, fetchAndShowAdmins, setIsAdminChanging }) => {
    const updateAdminAndShow = async () => {
        if (adminInfo.nameCheck.length === 0 && adminInfo.surnameCheck.length === 0
            && adminInfo.emailCheck.length === 0 && adminInfo.mobileNumCheck.length === 0) {

            let normalizedMobileNum = adminInfo.mobileNum;
            if (normalizedMobileNum.startsWith('+')) normalizedMobileNum = normalizedMobileNum.split('+').pop();
            if (normalizedMobileNum.startsWith('38')) normalizedMobileNum = normalizedMobileNum.split('38').pop();

            await updateUserInfo({
                id: admin.id,
                name: adminInfo.name,
                surname: adminInfo.surname,
                mobileNum: normalizedMobileNum,
                email: adminInfo.email,
            }, false)
                .then(data => {
                    if (data.mobileNum) adminInfo.setMobileNumCheck(data.mobileNum);
                    if (data.email) adminInfo.setEmailNumCheck(data.email);
                    if (data.token) {
                        fetchAndShowAdmins();
                        setIsAdminChanging();
                    }
                });
        }
    }

    return (
        <div className={styles.changeAdminForm}>
            <div className={styles.changeAdminForm__fields}>
                <ChangeFullInfoField name={'Name'} value={adminInfo.name} setValue={(value) => adminInfo.setName(value)} checkArray={adminInfo.nameCheck} />
                <ChangeFullInfoField name={'Surname'} value={adminInfo.surname} setValue={(value) => adminInfo.setSurname(value)} checkArray={adminInfo.surnameCheck} />

                <div className={styles.changeAdminForm__field}>
                    <div className={styles.changeAdminForm__label}><span>Phone number</span></div>
                    <IMaskInput
                        mask='+[380] 00 000 00 00'
                        className={styles.changeAdminForm__input}
                        style={adminInfo.mobileNumCheck.length == 0 ? { borderColor: '#a6a5a5' } : { borderColor: '#f84147' }}
                        value={adminInfo.mobileNum}
                        onChange={e => adminInfo.setMobileNum(e.target.value)}
                    />
                    <AlertsList checkArray={adminInfo.mobileNumCheck} />
                </div>

                <ChangeFullInfoField name={'Email'} value={adminInfo.email} setValue={(value) => adminInfo.setEmail(value)} checkArray={adminInfo.emailCheck} />
            </div>

            <div className={styles.changeAdminForm__buttons}>
                <button
                    className={
                        (adminInfo.nameCheck.length !== 0 || adminInfo.surnameCheck.length !== 0
                            || adminInfo.emailCheck.length !== 0 || adminInfo.mobileNumCheck.length !== 0)
                            ? `${styles.changeAdminForm__saveButton} ${styles.changeAdminForm__saveButtonNotActive}`
                            : styles.changeAdminForm__saveButton
                    }
                    onClick={() => updateAdminAndShow()}
                >
                    Save
                </button>
                <button
                    className={styles.changeAdminForm__cancelButton}
                    onClick={() => setIsAdminChanging(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
});

export default AdminChangeAdmin;