$.doTemplate = (function() {

    // template object constructor
    var t = function doTemplate(config) {

        this.source = config.source;
        this.data = config.data;

        if (this.data) this.compile(config.data);
        else this.compiled = null;
        
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
            
            // store compiled version as jQuery object (so we can clone it on render)
            this.compiled = $(frag);
            
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

            // we insert a clone, inc data,  so the same compiled template can be inserted multiple time
            $(selector)[type](this.compiled.clone(true));
            return this;
        }
    });
		
    return function() {
    
        // reference arguments for better compression
        var args = arguments,
            obj;

        // if no arguments we return an blank template object
        if (args.length === 0) return new t();
        
        // 1 argument
        if (args.length === 1) {

            // if argument is jquery object or an element we use get to return a new template object
            if (args[0] instanceof jQuery || args[0].nodeType) {

                obj = $.doTemplate.__(args[0]);

                return new t({
                    source: obj.source,
                    data: obj.data
                });
            };
        
            // if String we assume template source
            if (args[0].constructor == String) {
                return new t({
                    source: args[0]
                });
            };
            
            // if Object we crete a new template object
            if (args[0].constructor == Object) return new t(args[0]);
        };
                    
        // 2 arguments
        if (args.length === 2) {
        
            // string source, data
            if (args[0].constructor == String) {

                if (args[1] instanceof jQuery || args[1].nodeType) {

                    obj = $.doTemplate._(args[1]);

                    return new t({
                        source: args[0],
                        data: obj.data
                    });

                } else if(args[1].constructor == Object) {

                    return new t({
                        source: args[0],
                        data: args[1]
                    });
                };
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
    };

})();

$.doTemplate._ = function(elem) {

    var obj;

    if (elem instanceof jQuery) elem = elem[0];
    while (elem && elem.nodeType === 1 && !(obj = jQuery.data(elem, 'doTemplate')) && (elem = elem.parentNode)) {};
    return obj || null;

};
