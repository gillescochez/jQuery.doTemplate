/*! github.com/gillescochez/jQuery.doTemplate */

(function($){

$.doTemplate = (function() {

    // template object constructor
    var t = function (config) {

        this.source = config.source;
        this.data = config.data;
        this.settings = $.extend({}, $.doTemplate.settings, config.settings || {});

        if (this.source) this.compiler = $.doTemplate.engine(this.source, this.settings);

        if (this.data) this.compile(config.data);
        else this.compiled = null;
        
        return this;
    };
            
    // add some inherited methods
    $.extend(t.prototype, {

        // compile data using the compiler
        compile: function(data) {
        
            var frag = document.createDocumentFragment(),
                tmp = document.createElement('div'),
                compiler = this.compiler || $.doTemplate.engine(this.source),
                compiled_src, $item,
                add = function(i, object) {
                
                    // get the compiled source string
                    compiled_src = compiler(object);
 
                    // create a jQuery object
                    $item = $(compiled_src);

                    // is there some DOM? If not assume text and use a textNode instead 
                    if (!$item[0]) $item = $(document.createTextNode(compiled_src));
                    
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
            if (frag.constructor == String) this.compiled = frag;
            else this.compiled = $(frag);
            
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

                } else {

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

// original code from doT.js - 2011, Laura Doktorova https://github.com/olado/doT
$.doTemplate.engine = (function() {

    var resolveDefs = function(c, block, def) {

        return ((typeof block === 'string') ? block : block.toString()).replace(c.define, function (match, code, assign, value) {

            if (code.indexOf('def.') === 0) code = code.substring(4);

            if (!(code in def)) {
                if (assign === ':') def[code]= value;
                else eval("def[code]=" + value);
            };

            return '';
                
        }).replace(c.use, function(match, code) {

            var v = eval(code);
            return v ? resolveDefs(c, v, def) : v;

        });
    };

    return function(tmpl, c, def) {

        c = $.extend($.doTemplate.settings, c, true);

        var cstart = c.append ? "'+(" : "';out+=(",
            cend   = c.append ? ")+'" : ");out+='",
            str = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

        str = (
                "var out='" + ((c.strip) ? str.replace(/\s*<!\[CDATA\[\s*|\s*\]\]>\s*|[\r\n\t]|(\/\*[\s\S]*?\*\/)/g, '') : str)
                .replace(/\\/g, '\\\\')
                .replace(/'/g, "\\'")
                .replace(c.interpolate, function(match, code) {
                    return cstart + code.replace(/\\'/g, "'").replace(/\\\\/g,"\\").replace(/[\r\t\n]/g, ' ') + cend;
                })
                .replace(c.encode, function(match, code) {
                    return cstart + code.replace(/\\'/g, "'").replace(/\\\\/g, "\\").replace(/[\r\t\n]/g, ' ') 
                        + ").toString().replace(/&(?!\\w+;)/g, '&#38;').split('<').join('&#60;').split('>').join('&#62;').split('" 
                        + '"' + "').join('&#34;').split(" + '"' + "'" + '"' + ").join('&#39;').split('/').join('&#47;'" + cend;
                })
                .replace(c.evaluate, function(match, code) {
                    return "';" + code.replace(/\\'/g, "'").replace(/\\\\/g,"\\").replace(/[\r\t\n]/g, ' ') + "out+='";
                })
                + "';return out;"
        )
        .replace(/\n/g, '\\n')
        .replace(/\t/g, '\\t')
        .replace(/\r/g, '\\r')
        .split("out+='';").join('')
        .split("var out='';out+=").join('var out=');

        try { return new Function('$.extend(this,arguments[0]);' + str); } catch (e) { throw e; }
    };
})();

$.doTemplate.settings = {
    evaluate: /\{\{([\s\S]+?)\}\}/g,
    interpolate: /\{\{=([\s\S]+?)\}\}/g,
    encode: /\{\{!([\s\S]+?)\}\}/g,
    use: /\{\{#([\s\S]+?)\}\}/g,
    define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
    strip : false,
    append: true
};

$.fn.doTemplate = function(data, callback) {

    if (data instanceof jQuery || data.nodeType) {

        if (data instanceof jQuery) data = data[0];

        return $.doTemplate({
            source:$(this).html(),
            data: $.doTemplate._(data).data
        });
    };

    // simply return a new doTemplate object
    return $.doTemplate({
        source: $(this).html(),
        data: data,
        complete: callback
    });
};

})(jQuery);
