const { src, dest, watch, series, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const files = {
  scssPath: 'src/scss/main.scss',
  jsPath: 'src/js/**/*.js',
};

function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('public'));
}

function jsTask() {
  return src(files.jsPath)
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(dest('public'));
}

const cbString = new Date().getTime();
function cacheBustTask() {
  return src(['public/index.html'])
    .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
    .pipe(dest('.'));
}

function watchTask() {
  watch(
    [files.scssPath, files.jsPath],
    series(parallel(scssTask, jsTask), cacheBustTask)
  );
}

exports.default = series(parallel(scssTask, jsTask), cacheBustTask, watchTask);
