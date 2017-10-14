const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');

// Compile Sass & Inject Into Browser
gulp.task('sass', function() {
    return gulp.src(['src/scss/style.scss'])
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest("css/"))
        .pipe(browserSync.stream());
});

// Move JS Files to src/js
gulp.task('js', function() {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js','node_modules/popper.js/dist/umd/popper.min.js'])
        .pipe(gulp.dest("js"))
        .pipe(browserSync.stream());
});

// Watch Sass & Serve
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: ".",
        scrollRestoreTechnique: "cookie"
    });

    gulp.watch(['src/scss/*.scss'], ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('default', ['js','serve']);
