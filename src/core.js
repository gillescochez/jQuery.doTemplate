$.doTemplate = (function() {

	var templates = {},
	
		// name, source, data in config
		newTemplate = function(config) {
		
			// no name, not happy :(
			if (!config.name) throw '$.doTemplate: A name must be provided';
			
			// template object constructor
			templates[config.name] = (function(config) {
			
				return function() {
				
					this.name = config.name;
					this.source = config.source;
					
					if (config.data) {
						this.data = config.data;
						this.compile(config.data);
					};
					
					if (config.target) {
						if (this.compiled) this.render(config.target);
					};
					
					return this;
				};
				
			})(config);
			
			// add some inherited methods
			templates[config.name].prototype = (function(config) {
			
				return {
			
					// compiler internal function
					_compiler: $.doTemplate.template(config.source),
					
					// compile data using the compiler
					compile: function(data) {
					
						var frag = document.createDocumentFragment(),
							self = this,
							compiled_src, $item,
							add = function(i, object) {
							
								// get the compiled source string
								compiled_src = self._compiler(object);
								
								// create a jQuery object
								$item = $(compiled_src);
								
								$item.data('doTemplate', {
									dataObject: object
								}).each(function() {
									frag.appendChild($(this)[0]);
								});
							};
						
						// handle correct data
						data = data || this.data || false;
						if (!data) return this;
						
						// force data into an array if needed
						if (data.constructor == Object) data = [data];
						
						// loop through data and add new item
						$.each(data, add);
						
						// store compiled version
						this.compiled = frag;
						
						// if a target is set update it
						if (this.target) this.render(this.target);
						
						return this;
					},
					
					// append the compiled template to the given selector
					render: function(selector) {
					
						$(selector).append(this.compiled);
						return this;
					}
				};
			})(config);
			
			// create some settter function (might be worth porting to indiviual items if useful for individual updates)
			$.each(['Data', 'Source', 'Target'], function(i, prop) {

				templates[config.name].prototype['set' + prop] = (function(prop) {
				
					return function(val) {
						this[prop.toLowerCase()] = val;
						return this;
					};
				
				})(prop);
			});
			
			// return a new template object
			return new templates[config.name]();
		};
		
	return function() {
	
		// reference arguments for better compression
		var args = arguments;
	
		// if no arguments we throw an error
		if (args.length === 0) throw '$.doTemplate: required argument missing';
		
		// 1 argument
		if (args.length === 1) {
		
			// if String we create a new empty template object
			if (args[0].constructor == String) {
				return newTemplate({
					name: args[0]
				});
			};
			
			// if Object we crete a new template object
			if (args[0].constructor == Object) return newTemplate(args[0]);
			
			// if we end here throw an error
			throw '$.doTemplate: invalid argument';
		};
	
		return {};
	};

})();

$.doTemplate.get = function(elem) {

	var tmplItem;
	
	if ( elem instanceof jQuery ) elem = elem[0];
	while ( elem && elem.nodeType === 1 && !(tmplItem = jQuery.data( elem, 'doTemplate' )) && (elem = elem.parentNode) ) {}
	return tmplItem || null;

/*
	var $e = $(e),
		obj;
		
	while ($e && !(obj = $e.data('doTemplate')) && ($e = $e.parent())) {}
	
	while ($e && !$e.data('doTemplate')) {
		$e = $e.parent() || null; 
	};
	
	return $e.data('doTemplate') || null;
	
	return obj;*/
};