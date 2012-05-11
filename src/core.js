// template object constructor
var doTemplate = function(config) {

    var self = this;

    self.source = config.source;
    self.data = config.data;

    if (self.source) self.compiler = $.doTemplate.engine(self.source);
    else self.items = null;

    if (self.data && self.compiler) self.compile();

    self.$dom = undefined;
    
    return self;
};
        
// add some inherited methods
doTemplate.prototype = {

    // compile data using the compiler
    compile: function(data) {
     
        // sort the compiler out
        if (!this.compiler) this.compiler = $.doTemplate.engine(this.source);

        var res = [],
            source = this.source,
            compiler = this.compiler,
            add = function(object) {
                res.push({
                    data: object,
                    source: source,
                    compiler: compiler,
                    compiled: compiler(object)
                });
            },
            i = 0,
            len = 0;

        // handle correct data
        data = data || this.data || null;

        if (data) {
        
            // force data into an array if needed
            if (data.constructor == Array) {
                for (len = data.length; i < len; i++) add(data[i]);
            }
            else add(data);
           
            // store compiled version as jQuery object (so we can clone it on render)
            this.items = res;

            // reset the $dom cache
            this.$dom = null;

        };
        
        // keep chain
        return this;
    },

    // convert compiled data into dom (jQuery)
    toDom: function() {

        var frag = document.createDocumentFragment();

        $.each(this.items, function(i, item) { 
            $($(item.compiled).get() || document.createTextNode(item.compiled)).data('doTemplate', item).each(function() {
                frag.appendChild(this);
            });
        });

        // store DOM
        this.$dom = $(frag);

        // keep chain
        return this;
    },

    render: function(selector, type, clone) {

        // convert compiled data to DOM if needed
        if (!this.$dom) this.toDom();

        // we insert a clone, inc data,  so the same compiled template can be inserted multiple time
        $(selector)[type](clone ? this.$dom.clone(true) : this.$dom);

        // keep chain
        return this;
    }
};

$.each({appendTo: 'append', prependTo: 'prepend', insertBefore: 'before', insertAfter: 'after', replace: 'replaceWith'}, function(method, type) {
    doTemplate.prototype[method] = function(selector, clone) {
        return this.render(selector, type, clone);
    };
});

$.doTemplate = function(source, data) {
    
    // reference arguments for better compression
    var config = {},
        obj;

    // if argument is jquery object or an element we use get to return a new template object
    if (source.jquery || source.nodeType) {

        obj = $.doTemplate.extract(source);

        config = {
            source: obj.source,
            data: obj.data
        };
    };

    // if String we assume template source
    if (typeof source  === 'string') {

        if (data && (data.jquery || data.nodeType)) {

            obj = $.doTemplate.extract(data);

            config = {
                source: source,
                data: obj.data
            };

        } else {

            config = {
                source: source,
                data: data
            };
        };
    };
    
    // if Object we create a new template object
    if (!config && source.constructor == Object) settings = source;

    // return a new template object
    return new doTemplate(config);        
};

$.doTemplate.extract = function(elem) {

    var obj;

    if (elem.jquery) elem = elem[0];
    while (elem && (elem.nodeType === 1 || elem.nodeType === 3) && !(obj = $.data(elem, 'doTemplate')) && (elem = elem.parentNode)) {};
    return obj || null;

};
