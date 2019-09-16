resource_manifest_version '44febabe-d386-4d18-afbe-5e627f4af937'

ui_page 'html/index.html'

client_script {
	'config.js',
	'client.js'
}

server_script 'server.js'

dependency 'jsfour-core'

artifact_version '1.0.0.1222'

files {
	'html/index.html',
	'html/**/*.css',
	'html/**/*.js',
	'html/**/*.json',
	'html/**/*.html',
	'html/**/*.png',
	'html/**/*.jpg',
	'html/**/*.gif',
	'html/assets/css/*.css',
	'html/assets/js/*.js',
	'html/assets/js/*.json',
	'html/assets/sounds/*.ogg',
	'html/assets/images/*.png',
	'html/assets/images/*.jpg',
	'html/assets/images/*.gif',
	'html/assets/fonts/roboto/*.woff',
	'html/assets/fonts/roboto/*.woff2',
	'html/assets/fonts/justsignature/*.woff',
	'html/assets/fonts/handwritten/*.woff',	
}
