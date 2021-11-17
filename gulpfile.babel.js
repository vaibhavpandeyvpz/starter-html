import fs from 'fs';
import path from 'path';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import gulp from 'gulp';
import babel from 'gulp-babel';
import connect from 'gulp-connect';
import data from 'gulp-data';
import gif from 'gulp-if';
import imagemin from 'gulp-imagemin';
import notify from 'gulp-notify';
import nunjucks from 'nunjucks';
import nunjucks2 from 'gulp-nunjucks';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import sass from 'sass'
import sass2 from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';

const pkg = JSON.parse(fs.readFileSync('./package.json'));
const production = process.env.NODE_ENV === 'production';

function buildCss() {
  return gulp.src('src/css/**/*.scss')
    .pipe(plumber({
      errorHandler(err) {
        console.error(err);
        this.emit('end');
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(sass2(sass).sync())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(gif(production, postcss([ cssnano() ])))
    .pipe(sourcemaps.write('.'))
    .pipe(plumber.stop())
    .pipe(gulp.dest('build/css/'))
    .pipe(connect.reload());
}

function buildHtml() {
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/html'));
  return gulp.src(['src/**/*.njk', '!src/**/_*.njk'], { base: 'src/html' })
    .pipe(plumber({
      errorHandler(err) {
        console.error(err);
        this.emit('end');
      }
    }))
    .pipe(data((file) => {
      const json = `./src/html/${path.parse(file.path).name}.json`;
      const locals = fs.existsSync(json) ? JSON.parse(fs.readFileSync(json)) : {};
      const globals = JSON.parse(fs.readFileSync('./src/globals.json'));
      return { ...globals, ...locals };
    }))
    .pipe(nunjucks2.compile(null, { env }))
    .pipe(plumber.stop())
    .pipe(gulp.dest('build/'))
    .pipe(notify({
      message: pkg.name,
      title: 'Finished building styles!',
    }))
    .pipe(connect.reload());
}

function buildJs() {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber({
      errorHandler(err) {
        console.error(err);
        this.emit('end');
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gif(production, uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(plumber.stop())
    .pipe(gulp.dest('build/js/'))
    .pipe(notify({
      message: pkg.name,
      title: 'Finished building scripts!',
    }))
    .pipe(connect.reload());
}

export function images() {
  return gulp.src(['src/images/*', '!src/images/.gitkeep'], { base: 'src/images' })
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(plumber.stop())
    .pipe(gulp.dest('build/images/'))
    .pipe(notify({
      message: pkg.name,
      title: 'Finished minifying images!',
    }))
    .pipe(connect.reload());
}

export function server() {
  return connect.server({
    root: 'build',
    livereload: true
  });
}

function watchCss() {
  return gulp.watch('src/css/**/*', buildCss);
}

function watchHtml() {
  return gulp.watch('src/html/**/*', buildHtml);
}

function watchJs() {
  return gulp.watch('src/js/**/*', buildJs);
}

export const build = gulp.parallel(buildCss, buildHtml, buildJs);
export const watch = gulp.parallel(watchCss, watchHtml, watchJs);

export default gulp.series(build, images, gulp.parallel(server, watch));
