(function() {

    // doT.js by Laura Doktorova, https://github.com/olado/doT
    // slightly modified for doTemplate
    var doT = {
        version: '0.2.0',
        templateSettings: {
            shorttag:    /\$\{([^\}]*)\}/g,
            evaluate:    /\{\{([\s\S]+?)\}\}/g,
            interpolate: /\{\{=([\s\S]+?)\}\}/g,
            encode:      /\{\{!([\s\S]+?)\}\}/g,
            use:         /\{\{#([\s\S]+?)\}\}/g,
            define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
            conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
            iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
            varname: null,
            strip: true,
            append: true,
            selfcontained: false
        },
        template: undefined
    };

    var global = (function(){ return this || (0||eval)('this'); }());

    function encodeHTMLSource() {

        var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },
            matchHTML = /&(?!\\w+;)|<|>|"|'|\//g;

        return function(code) {
            return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : code;
        };
    };

    var startend = {
        append: { start: "'+(",      end: ")+'",      startencode: "'+encodeHTML(" },
        split:  { start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML("}
    }, skip = /$^/;

    function resolveDefs(c, block, def) {

        return ((typeof block === 'string') ? block : block.toString())
        .replace(c.define || skip, function(m, code, assign, value) {
            if (code.indexOf('def.') === 0) {
                code = code.substring(4);
            };

            if (!(code in def)) {
                if (assign === ':') {
                    def[code]= value;
                } else {
                    eval("def['"+code+"']=" + value);
                };
            };

            return '';
        })
        .replace(c.use || skip, function(m, code) {
            var v = eval(code);
            return v ? resolveDefs(c, v, def) : v;
        });
    };

    function unescape(code) {
        return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, ' ');
    };

    doT.template = function(tmpl, c, def) {

        c = c || doT.templateSettings;

        var cse = c.append ? startend.append : startend.split,
            str, needhtmlencode, 
            sid=0, indv;

        if (c.use || c.define) {

            var olddef = global.def; 
            global.def = def || {}; // workaround minifiers
            str = resolveDefs(c, tmpl, global.def);
            global.def = olddef;
        }
        else str = tmpl;

        str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g,' ').replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,''): str)
            .replace(/'|\\/g, '\\$&')
            .replace(c.shorttag || skip,'{{=$1}}')
            .replace(c.interpolate || skip, function(m, code) {
                return cse.start + unescape(code) + cse.end;
            })
            .replace(c.encode || skip, function(m, code) {
                needhtmlencode = true;
                return cse.startencode + unescape(code) + cse.end;
            })
            .replace(c.conditional || skip, function(m, elsecase, code) {
                return elsecase ?
                    (code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
                    (code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
            })
            .replace(c.iterate || skip, function(m, iterate, vname, iname) {
                if (!iterate) return "';} } out+='";
                sid+=1; 
                indv=iname || "i"+sid; 
                iterate=unescape(iterate);
                return "';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"+vname+"=arr"+sid+"["+indv+"+=1];out+='";
            })
            .replace(c.evaluate || skip, function(m, code) {
                return "';" + unescape(code) + "out+='";
            })
            + "';return out;")
            .replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r')
            .replace(/(\s|;|}|^|{)out\+='';/g, '$1').replace(/\+''/g, '')
            .replace(/(\s|;|}|^|{)out\+=''\+/g,'$1out+=');

        if (needhtmlencode && c.selfcontained) {
            str = "var encodeHTML=(" + encodeHTMLSource.toString() + "());" + str;
        };

        try {

            if (c.varname) return new Function(c.varname, str);
            else return new Function('this.$=jQuery;$.extend(this,arguments[0]);' + str);

        } catch (e) {

            if (typeof console !== 'undefined') console.log("Could not create a template function: " + str);
            throw e;
        };
    };

    // add references to $.doTemplate object
    $.doTemplate.engine = doT.template;
    $.doTemplate.engine.settings = doT.templateSettings;

}());
