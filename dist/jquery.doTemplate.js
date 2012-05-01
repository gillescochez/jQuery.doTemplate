/*! github.com/gillescochez/jQuery.doTemplate */

(function($){

$.doTemplate = (function() {

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
        
            var frag = document.createDocumentFragment(),
                tmp = document.createElement('div'),
                compiler = this.compiler || $.doTemplate.engine(this.source),
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
		
    return function() {
    
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

})();

$.doTemplate._ = function(elem) {

    var obj;

    if (elem.jquery) elem = elem[0];
    while (elem && elem.nodeType === 1 && !(obj = $.data(elem, 'doTemplate')) && (elem = elem.parentNode)) {};
    return obj || null;

};

(function() {

    // doT.js by Laura Doktorova, https://github.com/olado/doT
    // slightly modified for doTemplate
    var doT = {
        version: '0.2.0',
        templateSettings: {
            evaluate: true,
            interpolate: true,
            encode: true,
            use: true,
            define: true,
            conditional: true,
            iterate: true,
            shorttag: true,
            varname: false,
            strip: true,
            append: true,
            selfcontained: false
        },
        template: undefined
    },
    global = (function(){ return this || (0||eval)('this'); }());

    function encodeHTMLSource() {
        var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },
            matchHTML = /&(?!\\w+;)|<|>|\"|'|\//g;
        return function(code) {
            return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : code;
        };
    }
    
    global.encodeHTML = encodeHTMLSource();

    var startend = {
        append: { start: "'+(",      end: ")+'",      startencode: "'+encodeHTML(" },
        split:  { start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML("}
    }, skip = /$^/;

    function resolveDefs(c, block, def) {
        return ((typeof block === 'string') ? block : block.toString())
        .replace(c.define ? /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g : skip, function(m, code, assign, value) {
            if (code.indexOf('def.') === 0) {
                code = code.substring(4);
            }
            if (!(code in def)) {
                if (assign === ':') {
                    def[code]= value;
                } else {
                    eval("def['"+code+"']=" + value);
                }
            }
            return '';
        })
        .replace(c.use ? /\{\{#([\s\S]+?)\}\}/g :skip, function(m, code) {
            var v = eval(code);
            return v ? resolveDefs(c, v, def) : v;
        });
    }

    function unescape(code) {
        return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, ' ');
    }

    doT.template = function(tmpl, c, def) {

        c = c || doT.templateSettings;

        var cse = c.append ? startend.append : startend.split, 
            str, needhtmlencode, indv,
            sid = 0;

        if (c.use || c.define) {
            var olddef = global.def; 
            global.def = def || {}; // workaround minifiers
            str = resolveDefs(c, tmpl, global.def);
            global.def = olddef;
        } else str = tmpl;

        str = ("var out='" + (c.strip ? str.replace(/\s*<!\[CDATA\[\s*|\s*\]\]>\s*|[\r\n\t]|(\/\*[\s\S]*?\*\/)/g, '') : str)
            .replace(/'|\\/g, '\\$&')
            .replace(c.shorttag ? /\$\{([^\}]*)\}/g : skip, "{{=$1}}") 
            .replace(c.interpolate ? /\{\{=([\s\S]+?)\}\}/g : skip, function(m, code) {
                return cse.start + unescape(code) + cse.end;
            })
            .replace(c.encode ? /\{\{!([\s\S]+?)\}\}/g : skip, function(m, code) {
                needhtmlencode = true;
                return cse.startencode + unescape(code) + cse.end;
            })
            .replace(c.conditional ? /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g : skip, function(m, elsecase, code) {
                return elsecase ?
                    (code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
                    (code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
            })
            .replace(c.iterate ? /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g : skip, function(m, iterate, vname, iname) {

                if (!iterate) return "'} };out+='";

                sid += 1; 
                indv = iname || "i" + sid; 
                iterate = unescape(iterate);

                return "';var arr" + sid + "=" + iterate + ";if(arr" + sid + "){var " + indv + "=-1,l" + sid 
                     + "=arr" + sid + ".length-1;while(" + indv + "<l" + sid + "){" + vname + "=arr" + sid + "[" + indv + "+=1];out+='";
            })
            .replace(c.evaluate ? /\{\{([\s\S]+?)\}\}/g : skip, function(m, code) {
                return "';" + unescape(code) + "out+='";
            })
            + "';return out;")
            .replace(/\n/g, '\\n')
            .replace(/\t/g, '\\t')
            .replace(/\r/g, '\\r')
            .split("out+='';").join('')
            .split("var out='';out+=").join('var out=');

        if (needhtmlencode && c.selfcontained) {
            str = "var encodeHTML=(" + encodeHTMLSource.toString() + "());" + str;
        }

        try {
            // if no varname is requested we insert an extend call to make the data global in the function scope
            if (!c.varname) return new Function('this.$=jQuery;$.extend(this,arguments[0]);' + str);
            else return new Function(c.varname, str);
        } catch (e) {
            if (typeof console !== 'undefined') console.log("Could not create a template function: " + str);
            throw e;
        }
    };

    // add references to $.doTemplate object
    $.doTemplate.engine = doT.template;
    $.doTemplate.engine.settings = doT.templateSettings;

}());

$.fn.doTemplate = function(data, callback) {

    if (data.jquery || data.nodeType) {

        if (data.jquery) data = data[0];

        return $.doTemplate({
            source:$(this).html(),
            data: $.doTemplate._(data).data
        });
    };

    // simply return a new doTemplate object
    return $.doTemplate({
        source: $(this).html(),
        data: data
    });
};

})(jQuery);
