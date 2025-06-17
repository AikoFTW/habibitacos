const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { PORT, viewsPath, staticAssetsPath } = require('./config');
const routes = require('./routes');
const auth = require('./auth');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', viewsPath);

app.use('/assets', express.static(staticAssetsPath));
app.use('/', routes);

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res) => {
    res.status(404).redirect('/404');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
