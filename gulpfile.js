const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const del = require('del');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');

const browsersList = ['>= 0.5%'];

gulp.task('clean-css', () => {
  return del([
    'public/css/*',
  ]);
});

gulp.task('build-css-dev', () => {
  return gulp.src('src/scss/**')
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({ browsers: browsersList }),
    ]))
    .pipe(gulp.dest('public/css/'))
});

gulp.task('build-css-prod', () => {
  return gulp.src('src/scss/**')
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({ browsers: browsersList }),
      cssnano({
        safe: true,
      }),
    ]))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('css-dev', ['clean-css', 'build-css-dev']);
gulp.task('css-prod', ['clean-css', 'build-css-prod']);

gulp.task('css-watch', () => {
  return gulp.watch('src/scss/**', ['css-dev']);
});
