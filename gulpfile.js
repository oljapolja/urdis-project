// здесь переменные (запрашиваем из package.json)
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    gulpPug = require('gulp-pug'),
    gulpPlumber = require('gulp-plumber'),
    notify = require("gulp-notify");

// прописываем путь до sass папок библиотек --- сейчас подлключаем scss Bootstrap4 из папочки libs
const sassPaths = [
//	'node-bourbon'
//    './node_modules/bootstrap-sass/assets/stylesheets/' -- Bootstrap3
];

// прописываем пути до директорий и папок, чтобы ниже указывать их как переменные(постоянные)
const paths = {
    dist: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    src: {
        html: 'src/pug/*.pug',
        pugWatch: 'src/pug/**/*.pug',
        js: 'src/js/**/*.js',
        jsLib: [
            	'node_modules/jquery/dist/jquery.min.js',
   	        'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
            	'node_modules/owl.carousel/dist/owl.carousel.min.js',
   	        'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js',
   	        'node_modules/jquery-mousewheel/jquery.mousewheel.js',
   	        'node_modules/waypoints/lib/noframework.waypoints.min.js',
  	        'node_modules/jquery.scrollto/jquery.scrollTo.min.js',
   	        'node_modules/kbw-countdown/dist/js/jquery.plugin.js',
   	        'node_modules/kbw-countdown/dist/js/jquery.countdown.min.js',
   	        'node_modules/kbw-countdown/dist/js/jquery.countdown-ru.js',
   	        'node_modules/superfish/dist/js/superfish.min.js',
   	        'node_modules/jquery.mmenu/dist/jquery.mmenu.all.js',
  	        'src/libs/animate-css.js',
   	        'src/libs/landing-nav/navigation.js' //кастомный "библиотек" подключаем из папки
//		'src/libs/drawfillsvg.min.js'//кастомный "библиотек" подключаем из папки
        ],
        css: 'src/css/',
    	sass: 'src/sass/**/*.sass',
        img: 'src/img/**/*',
        fonts: 'src/fonts/**/*'
    }
};



//----------------------------------------------------------------------
// РАБОТАЕМ В SRC
// СЛЕДИМ ЗА ИЗМЕНЕНИЯМИ В SRC
// ЛЮБЫЕ ИЗМЕНЕНИЯ СРАЗУ ОТОБРАЖАЮТСЯ В DIST
// browser-Sync НАСТРОЕН НА ФАЙЛЫ DIST, ПОКАЗЫВАЕТ ЧТО ПРОИСХОДИТ В DIST
//----------------------------------------------------------------------



//----------------------------------------------------------------------
// задание для преобразования sass в css, запись в dist + отображение в browser-Sync
//это от webmaster, как понимаю тут все *.sass оптимизируются, но без cssnano(). Возможно параметр в sass  -- outputStyle: 'expand' их сжимает(значение мб :nested /:compact /:expanded /:compressed). Не могу понять оптимизирует или нет. Надо проверить вручную.
//----------------------------------------------------------------------
gulp.task('sass', function() {
	return gulp.src(paths.src.sass)
	.pipe(sass({outputStyle: 'expand', includePaths: sassPaths}).on("error", notify.onError()))
    //	.pipe(sass({outputStyle: 'expand', includePaths: require('node-bourbon').includePaths}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS( {level: { 1: { specialComments: 0 } } })) // Опционально, закомментировать при отладке
	.pipe(gulp.dest(paths.dist.css))    //сразу записывваем в dist
	.pipe(browserSync.reload({stream: true}));  //при изменении в src обновляет страницу ( можно так .pipe(browserSync.stream()) )
});



// задание для сжатия js-библиотек в одну минимизированную libs.min.js 
gulp.task('scripts_lib', function() {
    return gulp.src(paths.src.jsLib)
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/js'))    //сразу записывваем только в src, потом в gulp.task('scripts') складываем с common.js в один файл
});

// задание для суммирования файла библиотек и кастомного файлф со скриптами, запись в dist + отображение js-скриптов в browser-Sync
gulp.task('scripts', function() {
//    return gulp.src(paths.src.js) суммирует так, что common.js идет первым, следовательно пропишем ручками
    return gulp.src([
        'src/js/libs.min.js',
        'src/js/common.js', // Always at the end
        ])
    .pipe(concat('libs.min.js'))        //суммируем в один libs.min.js
    .pipe(gulp.dest(paths.dist.js))     //сразу записывваем libs.min.js в dist
    .pipe(browserSync.reload({stream : true}))  //при изменении в src обновляет страницу
});



//-------------------------------------------------------------------------------------------------------------------
//Преобразование src/pug/index.pug в dist/index.html  +  отображение dist/index.html  browser-Sync
//В папке src/pug/blocks создаем блоки.pug нашего сайта
//Далее ручками в файле src/pug/index.pug нужно заимпортить наши блоки.pug
//В gulp.task 'code' из файла src/pug/index.pug собирается полноценный index.html и записывается в папку dist/

//При изменении блоки.pug файл dist/index.html удаляется (смотри watch)
//В gulp.task 'code' из файла src/pug/index.pug собирается новый (с учетом изменений блоки.pug) полноценный index.html и записывается в папку dist/
//--------------------------------------------------------------------------------------------------------------------------
gulp.task('code', function() {
    return gulp.src(paths.src.html)
    // .pipe(gulpPlumber()) // при ошибке во время работы Pug вылетает gulp, чтобы не вылетал -млжго использовать Plumber
    .pipe(gulpPug({
                 pretty: true,
                 cache: true
             }).on("error", notify.onError())) // тоже позволяет gulp не вылетать при ошибке на Pug, оповещает
    .pipe(gulp.dest(paths.dist.html))   //сразу записывваем в dist
    .pipe(browserSync.reload({stream : true}))  //при изменении в src обновляет страницу
});

gulp.task('cleanCode', async function() { // При изменении любого pug удаляется index.html в папке dist (смотри watch)
    return del(paths.dist.html + '*.html');
});



// задание для browser-sync,  указываем директорию для сервера и выключаем оповещения
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'dist'
        },
        notify:true
	//tunnel: true
	//tunnel: "projectmane" //Demonstration page: http://projectmane.localtunnel.me
    });
});



gulp.task('cleanFonts', async function() {
    return del(paths.dist.fonts); // удаляем шрифты каждый раз при изменении в src (смотри watch)
});

gulp.task('fonts', async function() {
    var buildFonts = gulp.src(paths.src.fonts) //fonts
    .pipe(gulp.dest(paths.dist.fonts)); //записывваем в dist
});



gulp.task('cleanImg', async function() {
    return del(paths.dist.img); // удаляем картинки каждый раз при изменении в src (смотри watch)
});

// оптимизация изображений
gulp.task('img', function() {
    return gulp.src(paths.src.img)
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant]
    })))
    .pipe(gulp.dest(paths.dist.img)); //записывваем в dist
});

// чистим кэш, для случая, если фотографии перенесли в другую директорию ?? пока не использую
gulp.task('clear', function (callback) {
    return cache.clearAll();
});



// задание слежения, выполняется автоматически при вызове task 'default'
gulp.task('watch', function() {
    gulp.watch(paths.src.sass, gulp.parallel('sass')); //следим за sass
    gulp.watch(paths.src.pugWatch, gulp.series('cleanCode','code'));    //следим за за всеми pug. При изменении любого pug удаляется index.html в папке dist, потом из src/pug index.pug по-новому собирается (с учетом измененного файла) в dist/ index.html
    gulp.watch(paths.src.js, gulp.parallel('scripts')); //следим за js
    gulp.watch(paths.src.fonts, gulp.series('cleanFonts', 'fonts'));//следим за fonts, при изменении сначала удаляем всю папку в dist, потом перегосим из src
    gulp.watch(paths.src.img, gulp.series('cleanImg', 'img'));//следим за img, при изменении сначала удаляем всю папку в dist, потом перегосим из src
//    gulp.watch([paths.src.sass, paths.src.html, paths.src.js], gulp.parallel('build'));
});

// заполняем папку dist готовым материалом
gulp.task('prod_build', gulp.series('scripts_lib', 'cleanFonts', 'fonts', 'code', 'sass', 'scripts', 'cleanImg', 'img'));

// по дефолту вызываем нужные таски, вызываем в папке gulp
gulp.task('default', gulp.parallel('prod_build', 'watch', 'browser-sync'));

