// template object constructor
var doTemplate = function(config) {

        this.source = config.source;
        this.data = config.data; 

        if (this.source) this.compiler = $.doTemplate.engine(this.source);

        if (this.data) this.compile(config.data);
        else this.compiled = null;
        
        return this;
    },

    // string type helper
    isString = function(v) {
        return v.constructor == String;
    };
        
// add some inherited methods
$.extend(doTemplate.prototype, {

    // compile data using the compiler
    compile: function(data) {
     
        this.compiler = this.compiler || $.doTemplate.engine(this.source);


        var frag = document.createDocumentFragment(),
            tmp = document.createElement('div'),
            compiler = this.compiler,
            compiled_source, $item,
            add = function(i, object) {

                compiled_source = compiler(object);
                
                // create a jQuery object
                $item = $(compiled_source);

                // is there some DOM? If not assume text and use a textNode instead 
                if (!$item[0]) $item = $(document.createTextNode(compiled_source));
                
                $item.data('doTemplate', {
                    source: this.source,
                    data: object
                }).each(function() {
                    frag.appendChild(this);
                });
            };
                    
        // handle correct data
        data = data || this.data || null;
        if (!data) return this;
        
        // force data into an array if needed
        if (data.constructor != Array) data = [data];
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

$.doTemplate = function() {
    
    // reference arguments for better compression
    var args = arguments,
        obj, settings;

    // 1 argument
    if (args.length === 1) {

        // if argument is jquery object or an element we use get to return a new template object
        if (args[0].jquery || args[0].nodeType) {

            obj = $.doTemplate._(args[0]);

            settings = {
                source: obj.source,
                data: obj.data
            };
        };

        // if String we assume template source
        if (isString(args[0])) {
            settings = {
                source: args[0]
            };
        };
        
        // if Object we create a new template object
        if (!settings && args[0].constructor == Object) settings = args[0];
    };
                
    // 2 arguments
    if (args.length === 2) {
    
        // string source, data
        if (isString(args[0])) {

            if (args[1].jquery || args[1].nodeType) {

                obj = $.doTemplate._(args[1]);

                settings = {
                    source: args[0],
                    data: obj.data
                };

            } else {

                settings = {
                    source: args[0],
                    data: args[1]
                };
            };
        };
    };

    // return a new template object
    return new doTemplate(settings || {});        
};

// TODO Update so it can handle textNode too as used for pure text
$.doTemplate._ = function(elem) {

    var obj;

    if (elem.jquery) elem = elem[0];
    while (elem && elem.nodeType === 1 && !(obj = $.data(elem, 'doTemplate')) && (elem = elem.parentNode)) {};
    return obj || null;

};
