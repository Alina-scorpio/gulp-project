const { task, series, parallel, src, dest, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync' ).create()
const cssnano = require('cssnano')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')

const csscomb = require('gulp-csscomb') 
const autoprefixer = require('autoprefixer' )
const mqpacker = require('css-mqpacker' )
const sortCSSmq = require('sort-css-media-queries' )
const pug = require('gulp-pug')

const PATH = {
  scssRootFile: './assets/scss/style.scss',
  scssAllFiles: './assets/scss/**/*.scss',
  cssFolder: './assets/css/',
  htmlFolder: './',
  htmlAllFiles: './*.html',
  scssFolder: './assets/scss',
  pugFolder: './src/',
  pugAllFiles: './src/**/*.pug',
  pugRootFile: './src/index.pug',
  }

  const plugins = [
    autoprefixer({ overrideBrowserslist : ['last 5 versions' , '> 1%'], cascade: true }),
    mqpacker({ sort: sortCSSmq })
  ]

function scss() {
  return src(PATH.scssRootFile)
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss(plugins))
  .pipe(dest(PATH.cssFolder))
  .pipe(browserSync.stream());
  }
  function scssMin() {
    const pluginsExtended = [...plugins,cssnano({preset: 'default'})];
    return src(PATH.scssRootFile)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(pluginsExtended))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(PATH.cssFolder))
    }
      
  function syncInit () {
    browserSync.init({
    server: {
    baseDir: './'
    }
    });
    }
  async function sync() {
    browserSync. reload()
}

function compilePug() {
  return src(PATH.pugRootFile)
  .pipe(pug({ pretty: true }))
  .pipe(dest(PATH.pugFolder))
  }

  function watchFiles() {
    syncInit()
    watch(PATH.scssAllFiles, series(scss, scssMin) )
    watch(PATH.htmlAllFiles, sync)
    }

    function comb() {
      return src(PATH.scssAllFiles)
      .pipe(csscomb('./.csscomb.json' ))
      .pipe(dest(PATH.scssFolder))
      }
  
      function scssDev() {
        return src(PATH.scssRootFile, { sourcemaps: true })
        .pipe(sass().on('error', sass.logError))
        .pipe(dest(PATH.cssFolder, { sourcemaps: true }))
        .pipe(browserSync.reload({ stream: true }))
        }

  task('comb', comb)
  task('watch', watchFiles)
  task('scss', series(scss, scssMin))
  task('min', scssMin)
  task('dev', scssDev)
  task('pug', compilePug)
