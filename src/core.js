// template object constructor
var doTemplate = function(config) {

        this.source = config.source;
        this.data = config.data;

        if (this.source) this.compiler = $.doTemplate.engine(this.source);
        else this.compiled = null;

        if (this.data && this.compiler) this.compile();

        this.$dom = null;
        
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
     
        // sort the compiler out
        if (!this.compiler) this.compiler = $.doTemplate.engine(this.source);

        var compiled = [],
            source = this.source,
            compiler = this.compiler,
            add = function(object) {
                compiled.push({
                    data: object,
                    source: source,
                    compiler: compiler,
                    compiled: compiler(object)
                });
            };

        // handle correct data
        data = data || this.data || null;
        if (!data) return this;
        
        // force data into an array if needed
        if (data.constructor == Array) {
            for (var i = 0, len = data.length; i < len; i++) add(data[i]);
        }
        else add(data);
       
        // store compiled version as jQuery object (so we can clone it on render)
        this.compiled = compiled;

        // reset the $dom cache
        this.$dom = null;
        
        // keep chain
        return this;
    },

    // convert compiled data into dom (jQuery)
    toDom: function() {
        
        // holder dom 
        var dom = $(document.createElement('div'));

        // loop through compiled data
        $.each(this.compiled, function(i, item) {
            var elem = $(item.compiled).get() || document.createTextNode(item.compiled);
            $(elem).data('doTemplate', item);
            dom.append(elem);
        });

        // store DOM
        this.$dom = dom.children();

        // keep chain
        return this;
    },

    render: function(selector, type) {

        // convert compiled data to DOM if needed
        if (!this.$dom) this.toDom();

        // we insert a clone, inc data,  so the same compiled template can be inserted multiple time
        $(selector)[type](this.$dom.clone(true));

        // keep chain
        return this;
    }
});

$.each({appendTo: 'append', prependTo: 'prepend', insertBefore: 'before', insertAfter: 'after', replace: 'replaceWith'}, function(method, type) {
    doTemplate.prototype[method] = function(type) { 
        return function(selector) {
            return this.render(selector, type);
        };
    }(type);
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

// TODO Update so it can handle textNode too (not nodeType 1)
$.doTemplate._ = function(elem) {

    var obj;

    if (elem.jquery) elem = elem[0];
    while (elem && (elem.nodeType === 1 || elem.nodeType === 3) && !(obj = $.data(elem, 'doTemplate')) && (elem = elem.parentNode)) {};
    return obj || null;

};
