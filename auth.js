const fs = require('fs');
const path = require('path');

const accountsFilePath = path.join(__dirname, 'accounts.json');

function loadAccounts() {
    if (!fs.existsSync(accountsFilePath)) {
        fs.writeFileSync(accountsFilePath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(accountsFilePath));
}

function saveAccounts(accounts) {
    fs.writeFileSync(accountsFilePath, JSON.stringify(accounts, null, 2));
}

function authenticate(req, res, next) {
    const accounts = loadAccounts();
    const { username, password } = req.body;

    const user = accounts.find(acc => acc.username === username && acc.password === password);
    if (user) {
        req.session.user = user;
        return next();
    }

    res.status(401).render('login', { error: 'Invalid username or password' });
}

function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.status(403).render('login', { error: 'You must be logged in to access this page' });
}

function redirectIfAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return res.redirect('/manage');
    }
    next();
}

module.exports = {
    authenticate,
    ensureAuthenticated,
    redirectIfAuthenticated
};
