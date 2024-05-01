let preprocessor = 'sass', // Preprocessor (sass, less, styl); 'sass' also work with the Scss syntax in blocks/ folder.
		fileswatch   = 'html,htm,txt,json,md,woff2,js' // List of files extensions for watching & hard reload

import pkg from 'gulp'
const { src, dest, parallel, series, watch } = pkg

import browserSync   from 'browser-sync'
import bssi          from 'browsersync-ssi'
import ssi           from 'ssi'
import webpackStream from 'webpack-stream'
import webpack       from 'webpack'
import TerserPlugin  from 'terser-webpack-plugin'
import gulpSass      from 'gulp-sass'
import * as dartSass from 'sass'
const  sass          = gulpSass(dartSass)
import sassglob      from 'gulp-sass-glob'
import less          from 'gulp-less'
import lessglob      from 'gulp-less-glob'
import styl          from 'gulp-stylus'
import stylglob      from 'gulp-noop'
import postCss       from 'gulp-postcss'
import cssnano       from 'cssnano'
import autoprefixer  from 'autoprefixer'
import imagemin      from 'gulp-imagemin'
import changed       from 'gulp-changed'
import concat        from 'gulp-concat'
import rsync         from 'gulp-rsync'
import {deleteAsync} from 'del'
import pug from 'gulp-pug'
import media from 'gulp-merge-media-queries'

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/',
			middleware: bssi({ baseDir: 'app/', ext: '.html' })
		},
		// ghostMode: { 
		// 	clicks: false,
		// },
		ghostMode: false,
		notify: false,
		online: true,
		// lt --port 3000
	})
}

function scripts() {
	return src(['app/js/*.js', '!app/js/*.min.js'])
		.pipe(webpackStream({
			mode: 'production',
			performance: { hints: false },
			plugins: [
				// new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery' }), // jQuery (npm i jquery)
			],
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /(node_modules)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env'],
								plugins: ['babel-plugin-root-import']
							}
						}
					}
				]
			},
			optimization: {
				minimize: true,
				minimizer: [
					new TerserPlugin({
						terserOptions: { format: { comments: false } },
						extractComments: false
					})
				]
			},
		}, webpack)).on('error', function handleError() {
			this.emit('end')
		})
		.pipe(concat('app.min.js'))
		.pipe(dest('app/js'))
		.pipe(browserSync.stream())
}

function styles() {
	return src([`app/${preprocessor}/*.*`, `!app/${preprocessor}/_*.*`])
		.pipe(eval(`${preprocessor}glob`)())
		.pipe(eval(preprocessor)({ 'include css': true }))
		.pipe(media())
		.pipe(postCss([
			autoprefixer({ grid: 'autoplace' }),
			cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
		]))
		.pipe(concat('app.min.css'))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

function startwatch() {
	watch('app/pug/**/*.pug', { usePolling: true }, pugToHtml)
	watch([`app/${preprocessor}/**/*`], { usePolling: true }, styles)
	watch(['app/js/**/*.js', '!app/js/**/*.min.js'], { usePolling: true }, scripts)
	watch([`app/**/*.{${fileswatch}}`], { usePolling: true }).on('change', browserSync.reload)
}

function pugToHtml() {
	return src('app/pug/*.pug')
		.pipe(pug({
			pretty: '\t'
		}))
		.pipe(dest('app'))
}

// Concatination JS from modules

function libsjs() {
	return src([
		'node_modules/swiper/swiper-bundle.min.js',
		'node_modules/sweetalert2/dist/sweetalert2.all.min.js'
	])
		.pipe(concat('libs.min.js'))
		.pipe(dest('app/js'))
}

// Concatination CSS from modules

function libscss() {
	return src([
		'node_modules/normalize.css/normalize.css',
		'node_modules/swiper/swiper-bundle.min.css',
		'node_modules/sweetalert2/dist/sweetalert2.min.css'
	])
		.pipe(concat('libs.min.css'))
		.pipe(postCss([
			autoprefixer({ grid: 'autoplace' }),
			cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
		]))
		.pipe(dest('app/css'))
}

export let libs = series(libsjs, libscss)

export default series(scripts, styles, parallel(browsersync, startwatch, pugToHtml))
