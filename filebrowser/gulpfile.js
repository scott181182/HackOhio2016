var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    cleanCSS = require('gulp-clean-css'),
    html2js = require('gulp-ng-html2js'),
    uglify = require('gulp-uglify'),
    prettify = require('gulp-jsbeautifier'),
    del = require('del'),
    gulpNgConfig = require('gulp-ng-config'),
    inject = require('gulp-inject'),
    merge2 = require('merge2'),
    mainBower = require('main-bower-files')
    ;

var basePaths = {
    web: 'src/',
    app: 'src/app/',
    dist: '',
    prod: ''
};

var paths = {
    //html: basePaths.web + 'index.html',
    stylesheet: basePaths.web + 'less/stylesheet.less',
    js: basePaths.app + '/**/*.js',
    tpl: basePaths.app + '**/*.tpl.html',
    less: basePaths.web + '**/*.less'
};

var webFiles = [
  basePaths.app + '**/*.js',
  '!' + basePaths.app + '**/*spec.js'
];

gulp.task('jshint', function () {
  gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('clean:web', function(cb){
    del([basePaths.dist + '**/*'], {force: true}, cb);
});
gulp.task('clean:prod', function(cb){
    del([basePaths.prod + '**/*'], {force: true}, cb);
});

gulp.task('web:assets', function() {
    //gulp.src(paths.html)
    //    .pipe(gulp.dest(basePaths.dist));

    gulp.src(basePaths.web + 'assets/**')
        .pipe(gulp.dest(basePaths.dist));

    gulp.src(mainBower('**/fonts/*'))
        .pipe(gulp.dest(basePaths.dist + 'fonts'));
});
gulp.task('prod:assets', function() {
    //gulp.src(paths.html)
    //    .pipe(gulp.dest(basePaths.prod));

    gulp.src(basePaths.web + 'assets/**')
        .pipe(gulp.dest(basePaths.prod));

    gulp.src(mainBower('**/fonts/*'))
        .pipe(gulp.dest(basePaths.prod + 'fonts'));
});

gulp.task('web:js', function() {
  merge2(
      gulp.src(mainBower('**/*.js')), 
      gulp.src(webFiles),
      gulp.src(paths.tpl).pipe(html2js({ moduleName: 'templates.app' }))
    )
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(prettify({ mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest(basePaths.dist + 'js'));
});
gulp.task('prod:js', function() {
  merge2(
      gulp.src(mainBower('**/*.js')),
      gulp.src(webFiles),
      gulp.src(paths.tpl).pipe(html2js({ moduleName: 'templates.app' }))
    )
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest(basePaths.prod + 'js'));
});

gulp.task('web:css', function () {
  merge2(
      gulp.src(paths.stylesheet)
        .pipe(inject(gulp.src(paths.less, { read: false }), {
          starttag: '/* inject:imports */',
          endtag: '/* endinject:imports */',
          transform: function (filepath) { return '@import ".' + filepath + '";'; } 
        }))
        .pipe(less()),
      gulp.src(mainBower('**/*.css'))
    )
    .pipe(concat('app.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(basePaths.dist + 'css'));
});
gulp.task('prod:css', function () {
  merge2(
      gulp.src(paths.stylesheet)
        .pipe(inject(gulp.src(paths.less, { read: false }), {
          starttag: '/* inject:imports */',
          endtag: '/* endinject:imports */',
          transform: function (filepath) { return '@import ".' + filepath + '";'; } 
        }))
        .pipe(less()),
      gulp.src(mainBower('**/*.css'))
    )
    .pipe(concat('app.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(basePaths.prod + 'css'));
});

gulp.task('default', ['build:web']);

gulp.task('build:web',['web:js', 'web:css', 'web:assets']);

gulp.task('watch', function() {
  gulp.watch([
    'web/app/**/*.js',
    'web/**/*.html',
    'web/**/*.less',
    'gulpfile.js',
    '!web/app/config/config.js',
  ], [
    'jshint',
    'build:web'
  ]);
});



gulp.task('build:prod', ['prod:js', 'prod:css', 'prod:assets']);

gulp.task('test', function() {
  console.log(mainBower('**/fonts/*'));
})