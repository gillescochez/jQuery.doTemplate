test('Structure', function() {

    // some variables used for tests
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
        },
        custom = ['source', 'data', 'compiler', 'items', '$dom'],
        inherited = ['compile', 'toDom', 'appendTo', 'prependTo', 'insertAfter', 'insertBefore', 'replace', 'render'],
        template = $.doTemplate('${name}', {name: 'Paul'}).toDom();


    // number of tests expected
    expect(5 + custom.length + inherited.length);

    // test properties / methods exists
    ok($.doTemplate, '$.doTemplate');    
    ok($.doTemplate._, '$.doTemplate._'); 
    ok($.doTemplate.engine, '$.doTemplate.engine'); 
    ok($.doTemplate.engine.settings, '$.doTemplate.engine.settings'); 
    
    // check default doT settings are as expected
    deepEqual($.doTemplate.engine.settings, defaults, 'doT settings');

    // check for custom properties/methods
    $.each(custom, function(i, val) {
        ok(template[val], 'custom: ' + val);
    });

    // check for inherited methods
    $.each(inherited, function(i, val) {
        ok(template[val], 'inheroted: ' + val);
    });
});

// for compilation we don't check all template tags as that's already tested for doT
// we only need to make sure global variable and short tag
test('Compilation', function() {

    // some variables used for tests
    var dataObject = {name: 'Paul'},
        dataArray = [
            {name: 'Paul', age: 22},
            {name: 'Edouard', age: 13},
            {name: 'Jesus', age: 33}
        ],
        tags = {
            short: {
                tmpl: '${name}',
                res: 'Paul'
            },
            long: {
                tmpl: '{{=name}}',
                res: 'Paul'
            }
        },
        template, arr;

    // test short tag single object
    template = $.doTemplate(tags.short.tmpl, dataObject);
    equal(template.items[0].compiled, tags.short.res, '${name} single object');

    // test normal tag single object
    template = $.doTemplate(tags.long.tmpl, dataObject);
    equal(template.items[0].compiled, tags.long.res, '{{=name}} single object');
    
    // test with array data
    template.compile(dataArray);
    arr = [];
    
    $.each(template.items, function(i, item) {
        arr.push(item.compiled);
    });

    equal(arr.join(''), 'PaulEdouardJesus', 'with array');

});
