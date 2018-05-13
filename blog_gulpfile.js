var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var ts = require('gulp-typescript');
var htmlmin = require('gulp-htmlmin');
var gutil = require('gulp-util');

gulp.task("clean",function() {
    return gulp.src("./dst/*")
    .pipe(plugins.clean());
});

gulp.task("css",["clean"],function(){
    var stream = gulp.src(["public/**/*.css","!public/**/*.min.css"])
        .pipe(plugins.minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest("./dst/"));
    return stream;
});

gulp.task("js",["clean"],function(){
    var stream = gulp.src(["public/**/*.js","!public/**/*.min.js"])
         .pipe(ts({
           target: "es5",
           allowJs: true,
           module: "commonjs",
           moduleResolution: "node"
         }))
         .pipe(plugins.uglify())
         .on('error', function (err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString());
            })
        .pipe(gulp.dest("./dst/"));
    return stream;
});

gulp.task("html",["clean"],function(){
    var stream = gulp.src("public/**/*.html")
        //.pipe(plugins.minifyHtml({ quotes: false,loose: false }))
        //.pipe(plugins.rename({suffix: ".gulp"}))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("./dst/"));
    return stream;
});

gulp.task("mv",["html","css","js"],function() {
    var stream = gulp.src("./dst/*")
        /*.pipe(gulp.dest("./public/"));*/
        .pipe(plugins.shell([
            "\cp -rf ./dst/* ./public/"
        ]));
    return stream;
});

gulp.task("watch",function() {
    gulp.watch("public/*",["optimise"]);
});

gulp.task("default",["mv"],function(){
    console.log("gulp task ok!");
});
