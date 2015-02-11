/**
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    обьявляем переменные и зависимости
    после изменения код обфусцировать
    http://javascriptobfuscator.com/
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

var gulp         = require('gulp');
var livereload   = require('gulp-livereload');
var jade         = require('gulp-jade');
var imagemin     = require('gulp-imagemin');
var concat       = require('gulp-concat');
var coffee       = require('gulp-coffee');
var sass         = require('gulp-sass');
var gulpif       = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var spritesmith  = require('gulp.spritesmith');
var nib          = require('nib');
var connect      = require('connect');
var serveStatic  = require('serve-static');
var ftp          = require('gulp-ftp');
var csso         = require('gulp-csso');
var htmlmin      = require('gulp-htmlmin');

/**
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    задача создания спрайтов
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

gulp.task('sprite', function() {
    var spriteData =
        gulp.src('./img/sprite/*.*')
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: '_sprite.scss',
                imgPath: '../img/sprite.png',
                cssFormat: 'scss',
                algorithm: 'binary-tree',
                cssVarMap: function(sprite) {
                    sprite.name = 's-' + sprite.name
                }
            }));

    spriteData.img.pipe(gulp.dest('./img/optimize'));
    spriteData.css.pipe(gulp.dest('./scss/meta/'));
    spriteData.pipe(livereload());
});

/**
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    задача для закачки проекта на ftp
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/


gulp.task('upload', function () {
    return gulp.src([
        './**',
        '!./scss{,/**}',
        '!./node_modules{,/**}',
        '!./source{,/**}',
        '!./coffee{,/**}',
        '!./jade{,/**}',
        '!./img/sprite{,/**}',
        '!./img/optimize{,/**}',
        '!./ftpsync.settings',
        '!./gulpfile.js',
        '!./package.json',
        '!./README.md',
        '!./old{,/**}'
        ])
        .pipe(ftp({
            host: 'ftp7.hostia.name',
            user: 'newpage@vaeum.com',
            pass: 'bAWy3qRE',
            remotePath: "/"
        }));
});

/**
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    задача для компиляции jade
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

gulp.task('jade', function(){
    gulp.src('./jade/!(_)*.jade')
        .pipe(jade({
            pretty: true
        }))
    .on('error', console.log)
    // .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./'))
    .pipe(livereload());
});

/**
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    задача для конкатенации js скриптов
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

gulp.task('concat', function () {
    gulp.src('./js/*.js')
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./js/min/'))
        .pipe(livereload());
});

/**
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    задача для сжатия картинок
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

gulp.task('imagemin',function(){
    gulp.src('./img/optimize/*')
       .pipe(imagemin())
       .pipe(gulp.dest('./img/'))
       .pipe(livereload());
});

/**
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    задача для компиляции scss файлов
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

gulp.task('sass', function () {
    gulp.src('./scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'nested'
        }))
        .pipe(autoprefixer('last 2 version',
            'safari 5',
            'ie 8',
            'ie 9',
            'opera 12.1',
            'ios 6',
            'android 4'
            ))
        // .pipe(csso())
        .pipe(gulp.dest('./css'))
        .pipe(livereload());
});

/**
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    задача для autoprefixer
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

// gulp.task('autoprefixer', function () {
//     return gulp.src('css/*.css')
//         .pipe(autoprefixer({
//             browsers: [
//             'last 2 version',
//             'safari 5',
//             'ie 8',
//             'ie 9',
//             'opera 12.1',
//             'ios 6',
//             'android 4'
//             ],
//             cascade: false
//         }))
//         .pipe(gulp.dest('./css/'));
// });

/**
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    задача для обновления вкладки браузера при изменении
    html файла
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

gulp.task('livereload', function () {
    gulp.src('./*.html')
        .pipe(livereload());
});

/**
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    задача для компиляции coffee скриптов
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

gulp.task('coffee', function () {
    gulp.src('./coffee/**/*.coffee')
        .pipe(coffee({bare: true}))
        .on('error', console.log)
        .pipe(gulp.dest('./js'))
        .pipe(concat('scripts.js'))
        .pipe(livereload());
});

/**
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    создаем сервер
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

gulp.task('server', function () {
    connect()
        .use(require('connect-livereload')())
        .use(serveStatic(__dirname))
        .listen('3333');

    console.log('Адресс сервера: http://localhost:3333');
});

/**
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    список файлов для наблюдения
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch('./coffee/**/*.coffee', ['coffee']);
    // gulp.watch('./css/**/*.css', ['autoprefixer']);
    gulp.watch('./scss/**/*.scss', ['sass']);
    gulp.watch('./js/**/*.js', ['concat']);
    gulp.watch('./jade/**/*.jade', ['jade']);
    gulp.watch('./img/optimize/*',['imagemin']);
    gulp.watch('./*.html', ['livereload']);
    gulp.watch('./img/sprite/**/*.png', ['sprite']);
    gulp.start('server');
});

/**
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    задача по-умолчанию
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

gulp.task('default',
    [
        'watch',
        'coffee',
        'sass',
        'jade',
        // 'imagemin',
        'livereload'
        // 'sprite'
    ]
);
