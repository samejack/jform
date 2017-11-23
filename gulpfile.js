var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var mkdirp = require('mkdirp');
var webpack = require('webpack');
var uglify = require('uglify-js');

var NAME = 'jform';
var ENTRY = './src/jform.js';
var HEADER = './src/header.js';
var DIST = './dist';

// generate banner with today's date and correct version
function createBanner() {
  var today = gutil.date(new Date(), 'yyyy-mm-dd'); // today, formatted as yyyy-mm-dd
  var version = require('./package.json').version;  // math.js version

  return String(fs.readFileSync(HEADER))
    .replace('@@date', today)
    .replace('@@version', version);
}

var bannerPlugin = new webpack.BannerPlugin(createBanner(), {
  entryOnly: true,
  raw: true
});

// create a single instance of the compiler to allow caching
var compiler = webpack({
  entry: ENTRY,
  output: {
    library: 'jfrom',
    libraryTarget: 'umd',
    path: DIST,
    filename: NAME + '.js'
  },
  plugins: [bannerPlugin],
  module: {
    loaders: [
      {test: /\.json$/, loader: "json"}
    ]
  },
  cache: true
});

gulp.task('copy', ['minify'], function() {
  gulp
    .src([DIST + '/*'])
    .pipe(gulp.dest('docs/js'));
});

// make dist folder structure
gulp.task('mkdir', function () {
  mkdirp.sync(DIST);
});

// bundle javascript
gulp.task('bundle', ['mkdir'], function (done) {
  // update the banner contents (has a date in it which should stay up to date)
  bannerPlugin.banner = createBanner();

  compiler.run(function (err) {
    if (err) {
      gutil.log(err);
    }

    gutil.log('bundled ' + NAME + '.js');

    done();
  });
});

gulp.task('minify', ['bundle'], function () {

  var result = uglify.minify([DIST + '/' + NAME + '.js'], {
    outSourceMap: NAME + '.map',
    output: {
      comments: /@license/,
      max_line_len: 64000
    }
  });

  var fileMin = DIST + '/' + NAME + '.min.js';
  var fileMap = DIST + '/' + NAME + '.map';

  fs.writeFileSync(fileMin, result.code);
  fs.writeFileSync(fileMap, result.map);

  gutil.log('Minified ' + fileMin);
  gutil.log('Mapped ' + fileMap);
});

gulp.task('watch', ['bundle'], function () {
  gulp.watch(['src/**/*'], ['bundle', 'minify']);
});

gulp.task('docs', ['bundle', 'minify', 'copy']);

gulp.task('default', ['bundle', 'minify']);