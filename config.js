const path = require('path');

module.exports = {
    PORT: 3000,
    viewsPath: path.join(__dirname, 'views'),
    staticAssetsPath: path.join(__dirname, 'assets')
};
