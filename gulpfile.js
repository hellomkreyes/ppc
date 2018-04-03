'use strict'

const gulp = require("gulp");
const babel = require("babelify");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const notify = require("gulp-notify");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;


gulp.task("styles", () => {
  return gulp
    .src("./dev/styles/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer("last 2 version", "safari 5", "ie 8", "ie 9", "opera 12.1"))
    .pipe(concat("main.css"))
    .pipe(gulp.dest("./prod/styles/"))
    .pipe(reload({ stream: true }));
});

gulp.task("scripts", () => {
  return browserify("./dev/scripts/main.js", { debug: true })
    .transform("babelify", { sourceMaps: true, presets: ["es2015", "react"] })
    .bundle()
    .on("error", notify.onError({
        message: "Error: <%= error.message %>",
        title: "Error in JS 💀"
      }))
    .pipe(source("./dev/scripts/main.js"))
    .pipe(buffer())
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest("./prod/scripts"));
});


gulp.task('browser-sync', () => {
  browserSync.init({
    server: './prod'  
  })
});

gulp.task('watch', () => {
	gulp.watch('./dev/styles/**/*.scss', ['styles']);
	gulp.watch('./dev/scripts/*.js', ['scripts']);
	gulp.watch('./prod/*.html', reload);
});

gulp.task('default', ['browser-sync','styles', 'scripts', 'watch']);