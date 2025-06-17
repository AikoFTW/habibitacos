const express = require('express');
const router = express.Router();
const auth = require('./auth');
const events = require('./events');
const session = require('express-session');

router.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

router.get('/', (req, res) => {
    const upcomingEvents = events.getUpcomingEvents();
    res.render('index', { events: upcomingEvents });
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/catering', (req, res) => {
    res.render('catering');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/admin', auth.redirectIfAuthenticated, (req, res) => {
    res.render('login');
});

router.get('/404', (req, res) => {
    res.render('404');
});

router.post('/login', auth.authenticate, (req, res) => {
    res.redirect('/manage');
});

router.get('/manage', auth.ensureAuthenticated, (req, res) => {
    const upcomingEvents = events.getUpcomingEvents();
    res.render('manage', {
        user: req.session.user,
        events: upcomingEvents
    });
});

router.post('/manage/add-event', auth.ensureAuthenticated, (req, res) => {
    const { title, date, time, description } = req.body;
    events.addEvent({ title, date, time, description });
    res.redirect('/manage');
});

router.post('/manage/edit-event/:id', auth.ensureAuthenticated, (req, res) => {
    const { title, date, time, description } = req.body;
    events.updateEvent(req.params.id, { title, date, time, description });
    res.redirect('/manage');
});

router.post('/manage/delete-event/:id', auth.ensureAuthenticated, (req, res) => {
    events.deleteEvent(req.params.id);
    res.redirect('/manage');
});

module.exports = router;
