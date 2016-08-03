var gulp = require('gulp');
var fs = require('fs');
var browserify = require('gulp-browserify');
var crx = require('gulp-crx-pack');
var manifest = require('./manifest.json');

gulp.task('default', [ 'browserify', 'manifest', 'html', 'images', 'stylesheets', 'crx' ]);

gulp.task('browserify', function () {
    return gulp.src(['./assets/javascripts/*.js'])
        .pipe(browserify())
        .pipe(gulp.dest('./dist/bundles'));
});

gulp.task('manifest', function () {
    return gulp.src(['./manifest.json'])
        .pipe(gulp.dest('./dist'));
});

gulp.task('html', function () {
    return gulp.src(['./*.html'])
        .pipe(gulp.dest('./dist'));
});

gulp.task('images', function() {
    return gulp.src(['./assets/images/*.png'])
        .pipe(gulp.dest('./dist/assets/images')); 
});

gulp.task('stylesheets', function() {
    return gulp.src(['./assets/stylesheets/*.css'])
        .pipe(gulp.dest('./dist/assets/stylesheets'));
});

gulp.task('crx', function() {
  return gulp.src('./dist')
    .pipe(crx({
      privateKey: fs.readFileSync('./certificate/private.pem', 'utf8'),
      filename: manifest.name + '.crx'
    }))
    .pipe(gulp.dest('./build'));
});