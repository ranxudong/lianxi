//引入gulp及各种组件;
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(), //静态服务器
    htmlMin = require('gulp-htmlmin'),
    contentIncluder = require('gulp-content-includer'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    replace = require('gulp-replace'),
    uglify = require('gulp-uglify'), //压缩js
    cssmin = require('gulp-clean-css'), //压缩css
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector');  


    //gulp-rev 中 index.js  
    //135 行 ： manifest[originalFile] = revisionedFile; 
    //改为 ： manifest[originalFile] = originalFile + '?v=' + file.revHash;
    //
    //rev-path  中 index.js 
    // return modifyFilename(pth, (filename, ext) => `${filename}-${hash}${ext}`);
    //改为  return modifyFilename(pth, (filename, ext) => `${filename}${ext}`);
    //
    //gulp-rev-collector index.js
    // var cleanReplacement =  path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' );
    // 改为 var cleanReplacement =  path.basename(json[key]).split('?')[0];
    // 
    // regexp: new RegExp( prefixDelim + pattern, 'g' ),
    // 改为 regexp: new RegExp( prefixDelim + pattern + '(\\?v=\\w{10})?', 'g' ),


//配置自己的目录
var project = [
'public',
'industry',
//'home',
//'monitor',
];

//处理CSS文件:压缩,然后换个名输出;
gulp.task('css', function () {
    for(let i = 0;i<project.length;i++){
        gulp.src(`./src/${project[i]}/**/*.css`)
        .pipe(rev())
        .pipe(cssmin({
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        })) //压缩css
        .pipe(gulp.dest(`./build/${project[i]}/`));
    }
    gulp.src('./src/**/*.css')
    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest('./rev/css'));
});

//处理JS文件:压缩,然后换个名输出;
gulp.task('js', function () {
    for(let i = 0;i<project.length;i++){
        gulp.src(`./src/${project[i]}/**/*.js`)
        .pipe(rev())
        .pipe(uglify()) //压缩js
        .pipe(gulp.dest(`./build/${project[i]}/`));
    }
    gulp.src(`./src/**/*.js`)
    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest('./rev/js'));
});

gulp.task('html',function() {//HTML合并压缩模块
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        cssmin: true//压缩页面CSS
    }
    for(let i = 0;i<project.length;i++){
        gulp.src(['./rev/**/*.json',`./src/${project[i]}/**/*.html`])
        .pipe(contentIncluder({
            includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(revCollector({
            replaceReved: true
        }))
        //.pipe(htmlMin(options))  //发布时可以打开
        .pipe(replace('${Root}', '../../../src'))
        .pipe(gulp.dest(`./build/${project[i]}/`));
    }
    
});

//监控改动并自动刷新任务;
gulp.task('auto', function() {
    for(let i = 0;i<project.length;i++){
        gulp.watch(`./src/${project[i]}/**/*.css`, ['css']);
        gulp.watch(`./src/${project[i]}/**/*.js`, ['js']);
        gulp.watch(`./src/${project[i]}/**/*.html`, ['html']);
    }
    gulp.watch('./src/**/*.*').on('change', browserSync.reload);
});

//服务器任务:以build文件夹为基础,启动服务器;
gulp.task('server', function () {
    browserSync.init({
        server: "./"
    });
});

//gulp默认任务(集体走一遍,然后开监控);
gulp.task('default', ['server', 'auto', 'css', 'js', 'html']);

//不打开服务器，跑一遍打包 gulp run
gulp.task('run', ['css', 'js', 'html']);