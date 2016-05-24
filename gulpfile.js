var gulp = require('gulp');
var del = require('del');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var gulpSequence = require('gulp-sequence');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var minifyHtml = require('gulp-minify-html');

var app = 'app/';
var dist = 'dist/';
var assets = dist + 'assets/';

gulp.task('css', function () {
  // by default, gulp would pick `assets/css` as the base,
  // so we need to set it explicitly:
  return gulp.src(app + 'css/*.css')
    .pipe(cleanCSS())
    .pipe(rev())
    .pipe(gulp.dest(dist + 'css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest(assets));
});

gulp.task('js', function () {
  // by default, gulp would pick `assets/css` as the base,
  // so we need to set it explicitly:
  return gulp.src(app + 'js/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest(dist + 'js'))
    .pipe(rev.manifest(assets + 'rev-manifest.json', { merge: true, base: assets }))
    .pipe(gulp.dest(assets));
});

gulp.task('html', function () {
  // by default, gulp would pick `assets/css` as the base,
  // so we need to set it explicitly:
  return gulp.src([assets + '**/*.json', app + '*.html'])
    .pipe(revCollector())
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(gulp.dest(dist));
});

gulp.task('clean', function(cb) {
  return del([dist], cb);
});

gulp.task('default', gulpSequence('css', 'js', 'html'));

gulp.task('prod', gulpSequence('css', 'js', 'html'));

gulp.task('build', gulpSequence('clean', 'css', 'js', 'html'));