var gulp = require('gulp');
var browserify = require('browserify');
var packageJson = require('./package.json');
var loadTasks = require('module-boilerplate');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');

loadTasks(gulp, packageJson);

// override
var libName = packageJson.exports || packageJson.name;
gulp.task('standalone', function () {
    return browserify('./index.js')
      .transform('brfs')
      .bundle({
        standalone : libName
      })
      .pipe(source(packageJson.name + '.js'))
      .pipe(gulp.dest('./build/'));
  });

gulp.task('uglify', function() {
  return browserify('./index.js')
    .transform('brfs')
    .bundle({
      standalone : libName
    })
    .pipe(source(packageJson.name + '.min.js'))
    .pipe(streamify(uglify))
    .pipe(gulp.dest('./build/'));
});

gulp.task('default', ['standalone', 'uglify']);