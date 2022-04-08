import { makeAutoObservable } from 'mobx';
import { checkMobileNum, checkName, checkSurname } from '../utils/authCheck';

export default class OrderStore {
    constructor() {
        this._cart = [];

        this._name = null;
        this._nameCheck = [];
        this._surname = null;
        this._surnameCheck = [];
        this._mobileNum = null;
        this._mobileNumCheck = [];

        this._selectedCompany = 0;
        this._selectedCompanyCheck = [];
        this._selectedCity = 0;
        this._selectedCityCheck = [];
        this._selectedDepartment = 0;
        this._selectedDepartmentCheck = [];
        this._paymentOption = null;
        this._paymentOptionCheck = [];
        
        this._orderStatus = 1;

        makeAutoObservable(this);
    }

    clearPersonalInfo() {
        this._name = null;
        this._nameCheck = [];
        this._surname = null
        this._surnameCheck = [];
        this._mobileNum = null
        this._mobileNumCheck = [];
    }


    setCart(cart) { this._cart = cart }
    get cart() { return this._cart }

    
    setName(name) { [this._name, this._nameCheck] = checkName(name) }
    get name() { return this._name; }
    get nameCheck() { return this._nameCheck; }

    setSurname(surname) { [this._surname, this._surnameCheck] = checkSurname(surname) }
    get surname() { return this._surname }
    get surnameCheck() { return this._surnameCheck }

    setMobileNum(mobileNum) { [this._mobileNum, this._mobileNumCheck] = checkMobileNum(mobileNum) }
    get mobileNum() { return this._mobileNum }
    get mobileNumCheck() { return this._mobileNumCheck }


    setSelectedCompany(selectedCompany) { this._selectedCompany = selectedCompany }
    setSelectedCompanyCheck(alert) {
        if (!alert) this._selectedCompanyCheck = [];
        else this._selectedCompanyCheck = [alert];
    }
    clearSelectedCompany() {
        this._selectedCompany = 0;
        this._selectedCompanyCheck = [];
    }
    get selectedCompany() { return this._selectedCompany }
    get selectedCompanyCheck() { return this._selectedCompanyCheck }

    setSelectedCity(selectedCity) { this._selectedCity = selectedCity }
    setSelectedCityCheck(alert) {
        if (!alert) this._selectedCityCheck = [];
        else this._selectedCityCheck = [alert];
    }
    clearSelectedCity() {
        this._selectedCity = 0;
        this._selectedCityCheck = [];
    }
    get selectedCity() { return this._selectedCity }
    get selectedCityCheck() { return this._selectedCityCheck }

    setSelectedDepartment(selectedDepartment) { this._selectedDepartment = selectedDepartment }
    setSelectedDepartmentCheck(alert) {
        if (!alert) this._selectedDepartmentCheck = [];
        else this._selectedDepartmentCheck = [alert];
    }
    clearSelectedDepartment() {
        this._selectedDepartment = 0;
        this._selectedDepartmentCheck = [];
    }
    get selectedDepartment() { return this._selectedDepartment }
    get selectedDepartmentCheck() { return this._selectedDepartmentCheck }

    setPaymentOption(paymentOption) { this._paymentOption = paymentOption }
    setPaymentOptionCheck(alert) {
        if (!alert) this._paymentOptionCheck = [];
        else this._paymentOptionCheck = [alert];
    }
    get paymentOption() { return this._paymentOption }
    get paymentOptionCheck() { return this._paymentOptionCheck }


    setOrderStatus(orderStatus) { this._orderStatus = orderStatus }
    get orderStatus() { return this._orderStatus }
}