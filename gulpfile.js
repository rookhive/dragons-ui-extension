require('dotenv').config()

const isDev = process.env.NODE_ENV === 'development'
const { task, src, dest, lastRun, series, watch } = require('gulp')
const sass = require('gulp-sass')
const gulpIf = require('gulp-if')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')

sass.compiler = require('node-sass')

task('sass', () => (
    src('./src/features/**/*.sass', { since: lastRun('sass') })
        .pipe(gulpIf(isDev, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulpIf(isDev, sourcemaps.write()))
        .pipe(dest('./extension/features/'))
))

task('features', () => (
    src('./src/features/**/inject.js', { since: lastRun('features') })
        .pipe(dest('./extension/features/'))
))

task('extension', () => (
    src('./src/extension/**/*.*', { since: lastRun('extension') })
        .pipe(dest('./extension/'))
))

task('watch', () => {
    watch('./src/features/**/*.sass', series('sass'))
    watch('./src/features/**/inject.js', series('features'))
    watch('./src/extension/**/*.*', series('extension'))
})

task('build', series('extension', 'sass', 'features'))