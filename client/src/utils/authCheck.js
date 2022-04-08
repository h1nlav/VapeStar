const checkLogin = (login) => {
    let tmpArray = [];

    if (login.length == 0) tmpArray.push('Login cannot be empty');
    else if (login.length <= 5) tmpArray.push('Login is too short');
    else if (login.length > 50) tmpArray.push('Login is too long');
    if (login.indexOf(' ') >= 0) tmpArray.push('Login cannot contain spaces');
    if (!login.match("^[a-zA-Z0-9_.@+]*$"))
        tmpArray.push('Login can only include latin letters (a-z), numbers (0-9), underscore (_) and dot (.)');

    return [login, tmpArray]
}

const checkLoginPassword = (loginPassword) => {
    let tmpArray = [];

    if (loginPassword.length == 0) tmpArray.push('Password cannot be empty');
    else if (loginPassword.length < 6) tmpArray.push('Password is too short');
    else if (loginPassword.length > 50) tmpArray.push('Password is too long');

    return [loginPassword, tmpArray]
}

const checkRegPassword = (regPassword) => {
    let tmpArray = [];

    if (regPassword.length < 6) tmpArray.push('Password must contain at least 6 characters');
    else if (regPassword.length > 50) tmpArray.push('Password is too long');
    if (!/[A-Z]/.test(regPassword)) tmpArray.push('Password must contain capital letters');
    if (!/\d/.test(regPassword)) tmpArray.push('Password must contain numbers');
    if (!regPassword.match("^[a-zA-Z0-9_.@]*$"))
        tmpArray.push('Password can only include latin letters (a-z), numbers (0-9), underscore (_) and dot (.)');

    return [regPassword, tmpArray]
}

const checkName = (name) => {
    let tmpArray = [];
    if (name.length === 0 ) tmpArray.push('This field is required');
    if (name.length > 50) tmpArray.push('Name is too long');

    return [name, tmpArray]
}

const checkSurname = (surname) => {
    let tmpArray = [];

    if (surname.length === 0 ) tmpArray.push('This field is required');
    if (surname.length > 50) tmpArray.push('Surname is too long');

    return [surname, tmpArray]
}

const checkMobileNum = (mobileNum) => {
    let tmpArray = [];
    if (!mobileNum.startsWith('+38') && mobileNum.length === 10) return [mobileNum, tmpArray];
    else {
        if (mobileNum.length === 0 ) tmpArray.push('This field is required');
        else if (mobileNum.length !== 17) tmpArray.push('Please enter a valid phone number');
        mobileNum = mobileNum.replace(/\s/g, '');

        return [mobileNum, tmpArray]
    }
}

const checkEmail = (email) => {
    let tmpArray = [];

    if (email.length === 0
        || !email.match("^[a-zA-Z0-9_.@]*$")
        || email.indexOf('@') < 0
        || email.split('@').pop().indexOf('.') < 0) tmpArray.push('Please enter a valid email');
    if (email.length > 50) tmpArray.push('Email is too long');

    return [email, tmpArray]
}

export {
    checkLogin,
    checkLoginPassword,
    checkRegPassword,
    checkName,
    checkSurname,
    checkMobileNum,
    checkEmail,
}