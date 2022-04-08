import { makeAutoObservable } from 'mobx';
import { checkEmail, checkLogin, checkLoginPassword, checkMobileNum, checkName, checkRegPassword, checkSurname } from '../utils/authCheck';

export default class AuthStore {
    constructor() {
        this._user = {};
        this._isAuth = false;

        this._login = null;
        this._loginCheck = [];
        this._loginPassword = null;
        this._loginPasswordCheck = [];

        this._name = null;
        this._nameCheck = [];
        this._surname = null;
        this._surnameCheck = [];
        this._mobileNum = null;
        this._mobileNumCheck = [];
        this._email = null;
        this._emailCheck = [];
        this._regPassword = null;
        this._regPasswordCheck = [];

        makeAutoObservable(this);
    }

    resetAuthStore() {
        this._login = null;
        this._loginCheck = [];
        this._loginPassword = null;
        this._loginPasswordCheck = [];
        this._loginPassword = null;
        this._loginPasswordCheck = [];
        this._name = null
        this._nameCheck = [];
        this._surname = null
        this._surnameCheck = [];
        this._mobileNum = null
        this._mobileNumCheck = [];
        this._email = null;
        this._emailCheck = [];
        this._regPassword = null
        this._regPasswordCheck = [];
    }

    setUser(user) { this._user = user }
    setIsAuth(isAuth) { this._isAuth = isAuth }
    get user() { return this._user }
    get isAuth() { return this._isAuth }

    setLogin(login) { [this._login, this._loginCheck] = checkLogin(login) }
    setLoginCheck(alert) { this._loginCheck = [alert] }
    get login() { return this._login }
    get loginCheck() { return this._loginCheck }

    setLoginPassword(loginPassword) { [this._loginPassword, this._loginPasswordCheck] = checkLoginPassword(loginPassword) }
    setLoginPasswordCheck(alert) { this._loginPasswordCheck = [alert] }
    get loginPassword() { return this._loginPassword }
    get loginPasswordCheck() { return this._loginPasswordCheck }

    setName(name) { [this._name, this._nameCheck] = checkName(name) }
    get name() { return this._name; }
    get nameCheck() { return this._nameCheck; }

    setSurname(surname) { [this._surname, this._surnameCheck] = checkSurname(surname) }
    get surname() { return this._surname }
    get surnameCheck() { return this._surnameCheck }

    setMobileNum(mobileNum) { [this._mobileNum, this._mobileNumCheck] = checkMobileNum(mobileNum) }
    setMobileNumCheck(alert) { this._mobileNumCheck = [alert] }
    get mobileNum() { return this._mobileNum }
    get mobileNumCheck() { return this._mobileNumCheck }

    setEmail(email) { [this._email, this._emailCheck] = checkEmail(email) }
    setEmailCheck(alert) { this._emailCheck = [alert] }
    get email() { return this._email }
    get emailCheck() { return this._emailCheck }

    setRegPassword(regPassword) { [this._regPassword, this._regPasswordCheck] = checkRegPassword(regPassword) }
    get regPassword() { return this._regPassword }
    get regPasswordCheck() { return this._regPasswordCheck }
}