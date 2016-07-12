const browserify = require('browserify');
const fs = require('fs');

const bundles = [
    {
        name: 'background',
        asset: './assets/javascripts/background.js'
    },
    {
        name: 'panel',
        asset: './assets/javascripts/panel.js'
    },
    {
        name: 'sidebar-analytics',
        asset: './assets/javascripts/sidebar-analytics.js'
    },
    {
        name: 'sidebar-pageview',
        asset: './assets/javascripts/sidebar-pageview.js'
    },
    {
        name: 'devtools',
        asset: './assets/javascripts/devtools.js'
    },
    {
        name: 'tagging',
        asset: './assets/javascripts/tagging.js'
    }
];

const bundlesDirectory = './bundles/';

function buildBundles() {
    console.log('Creating bundles ...');
    for (var i = 0; i < bundles.length; i++) {
        buildBundle(bundles[i]);
    }
    console.log('Bundles created successfully');
}

function buildBundle(bundle) {
    console.log('\t* Creating bundle ' + bundle.name + ' ...');
    
    if (!fs.existsSync(bundlesDirectory)) {
        fs.mkdirSync(bundlesDirectory);
    }
    
    browserify()
        .add(bundle.asset)
        .bundle()
        .pipe(fs.createWriteStream(bundlesDirectory + bundle.name + '.js'));    
}

buildBundles();