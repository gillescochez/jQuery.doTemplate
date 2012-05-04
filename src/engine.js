(function() {

    // doT.js by Laura Doktorova, https://github.com/olado/doT
    // slightly modified for doTemplate
    var doT = {
        version: '0.2.0',
        templateSettings: {
            evaluate: true,
            interpolate: true,
            encode: true,
            use: false,
            define: false,
            conditional: true,
            iterate: true,
            shorttag: true,
            strip: true,
            append: false,
            selfcontained: false,
            varname: false
        },
        template: undefined
    },
    global = (function(){ return this || (0||eval)('this'); }()),
    startend = {
        append: { start: "'+(",      end: ")+'",      startencode: "'+encodeHTML(" },
        split:  { start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML("}
    },
    skip = /$^/;

    function encodeHTMLSource() {
        var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },
            matchHTML = /&(?!\\w+;)|<|>|\"|'|\//g;
        return function(code) {
            return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : code;
        };
    }
    
    global.encodeHTML = encodeHTMLSource();

    function resolveDefs(c, block, def) {
        return (typeof block == 'string' ? block : block.toString())
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
            str, needhtmlencode, indv, olddef,
            sid = 0;

        if (c.use || c.define) {

            olddef = global.def; 

            global.def = def || {}; // workaround minifiers
            str = resolveDefs(c, tmpl, global.def);
            global.def = olddef;
        }
        else str = tmpl;

        str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g,' ').replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,''): str)
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
            if (!c.varname) return new Function('$.extend(this,arguments[0]);' + str);
            else return new Function(c.varname, str);
        } catch (e) {
            if (window.console) console.log("Could not create a template function: " + str);
            throw e;
        }
    };

    // add references to $.doTemplate object
    $.doTemplate.engine = doT.template;
    $.doTemplate.engine.settings = doT.templateSettings;

}());
