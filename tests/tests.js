test('Structure', function() {

    var defaults = {
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
        };

    // test properties / methods exists
    ok($.doTemplate, '$.doTemplate');    
    ok($.doTemplate._, '$.doTemplate._'); 
    ok($.doTemplate.engine, '$.doTemplate.engine'); 
    ok($.doTemplate.engine.settings, '$.doTemplate.engine.settings'); 
    
    // check default doT settings are as expected
    deepEqual($.doTemplate.engine.settings, defaults, 'doT settings');
});

test('Compilation', function() {

    var dataObject = {name: 'Paul'},
        dataArray = [
            {name: 'Paul', age: 22},
            {name: 'Edouard', age: 13},
            {name: 'Jesus', age: 33}
        ],
        tags = {
            short: '${name}',
            long: '{{=name}}'
        };

});
