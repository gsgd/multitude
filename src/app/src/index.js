if (process.env.NODE_ENV === 'development') {
    const electronHot = require('electron-hot-loader');
    electronHot.install();
    electronHot.watchJsx(['src/**/*.js']);
    electronHot.watchCss(['assets/**/*.css']);
}

// require('./index.jsx');
require('./app/main.js')
