$.doTemplate = (function() {

    // error reporting function
    var err = function(message) {

            var msg = '$.doTemplate: ' + message;

            if (window.console && console.log) {
                if (console.error) console.error(msg);
                else console.log(msg);
            } else throw msg;
        },
                
        // template object constructor
        t = function doTemplate(config) {

            this.source = config.source;
            this.data = config.data;
            
            if (this.data) this.compile(config.data);
            
            return this;
        };
            
    // add some inherited methods
    $.extend(t.prototype, {

        // compile data using the compiler
        compile: function(data) {
        
            var frag = document.createDocumentFragment(),
                compiler = $.doTemplate.engine(this.source),
                compiled_src, $item,
                add = function(i, object) {
                
                    // get the compiled source string
                    compiled_src = compiler(object);
                    
                    // create a jQuery object
                    $item = $(compiled_src);
                    
                    $item.data('doTemplate', {
                        source: this.source,
                        data: object
                    }).each(function() {
                        frag.appendChild(this);
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
            
            return this;
        },

        appendTo: function(selector) {
            return this.render(selector, 'append');
        },
 
        prependTo: function(selector) {
            return this.render(selector, 'prepend');
        },
        
        insertBefore: function(selector) {
            return this.render(selector, 'before');
        },
 
        insertAfter: function(selector) {
            return this.render(selector, 'after');
        },

        replace: function(selector) {
            return this.render(selector, 'replaceWith');
        },

        render: function(selector, type) {
            $(selector)[type](this.compiled);
            return this;
        }
    });
		
    return function() {
    
        // reference arguments for better compression
        var args = arguments;

        // if no arguments we throw an error (we require at least an identifier)
        if (args.length === 0) err('required argument missing');
        
        // 1 argument
        if (args.length === 1) {
        
            // if String we assume template source
            if (args[0].constructor == String) {
                return new t({
                    source: args[0]
                });
            };
            
            // if Object we crete a new template object
            if (args[0].constructor == Object) return new t(args[0]);
            
            // if we end here throw an error
            err('invalid argument');
        };
                    
        // 2 arguments
        if (args.length === 2) {
        
            // string source, data
            if (args[0].constructor == String && args[1].constructor == Object) {
                return new t({
                    source: args[0],
                    data: args[1]
                });
            };
        };
        
        // 3 arguments
        if (args.length === 3) {
        
            // string source, data, target
            if (args[0].constructor == String && args[1].constructor == Object) {
                return new t({
                    source: args[0],
                    data: args[1],
                    target: args[2]
                });
            };
        };

        // if we end here return null so we can see it failed
        err('Invalid request');
    };

})();

$.doTemplate.get = function(elem) {

    var tmplItem;

    if ( elem instanceof jQuery ) elem = elem[0];
    while ( elem && elem.nodeType === 1 && !(tmplItem = jQuery.data(elem, 'doTemplate')) && (elem = elem.parentNode) ) {};
    return tmplItem || null;

};
