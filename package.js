Package.describe({
	summary: 'Enhanced and extra form fields'
});

Package.on_use(function(api, where) {
	api.use(['session', 'handlebars', 'underscore', 'templating', 'jwerty', 'deps'], 'client');

	api.add_files([
		'lib/underscore_mixins.js',
		'field.js',
		
		'text_field.html',
		'text_field.js',
		
		'date_field.html',
		'date_field.js',
		
		'decimal_field.html',
		'decimal_field.js',
		'decimal_field.css',
		
		'category_field.html',
		'category_field.js',
		'category_field.css',
		
	], 'client');
});

Package.on_test(function (api) {
  api.use('fields');

  api.add_files('tests.js', ['client', 'server']);
});
