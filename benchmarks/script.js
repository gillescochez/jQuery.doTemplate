var suite = new Benchmark.Suite,
    doTDiv, tmplDiv,
    resetDiv = function() {
        doTDiv = document.createElement('div');
        tmplDiv = document.createElement('div');
    },
    run = function() {
        suite.run({
            async: true,
            delay: 500
        });
    },
    tests = {
        simple: {
            data: {name:'Paul'},
            doTTemplate: '${name}',
            tmplTemplate: '${name}'
        },
        normal: {
            data:[
                {name:'Paul', age:16},
                {name:'Jean', age:20},
                {name:'Henri', age:30},
                {name:'Simon', age:60}
            ],
            doTTemplate:  '<p>${name} {{? age < 18}}yes{{??}}no{{?}}</p>',
            tmplTemplate: '<p>${name} {{if age < 18}}yes{{else}}no{{/if}}</p>'
        },
        complex: {
            data:[{
                name:'John',
                age:50,
                children: [
                    {name:'Jane', age:16},
                    {name:'Jean', age:14},
                    {name:'Paul', age:6}
                ]
            }, {
                name:'Sean',
                age:30,
                children: [
                    {name:'Tony', age:3}
                ]
            }],
            doTTemplate:'<p>${name}</p><p><b>Children:</b><ul>{{~ children :child}}<li>${child.name}: ${child.age}</li>{{~}}</ul></p>',
            tmplTemplate:'<p>$(name}</p><p><b>Children:</b><ul>{{each children}}<li>$($Value.name}: $($Value.age}</li>{{/each}}</ul></p>'
        }
    },
    test = 'simple',
    firstrun = false,
    doTemplate,
    tmpl = 'simple';

for (var i in tests) {
    $.template(i, i.tmplTemplate);
}

// doTemplate test
suite.add('jQuery.doTemplate', function() {

   //$.doTemplate(tests[test].doTTemplate, tests[test].data).appendTo(doTDiv);
   doTemplate.compile(tests[test].data).appendTo(doTDiv);

   if (!firstrun) {
        firstrun = true;
        console.log(doTDiv.innerHTML);
   };
 
})

// tmpl test
.add('jQuery.tmpl', function() {
    $.tmpl(tests[test].tmplTemplate, tests[test].data).appendTo(tmplDiv);
})

// display result when all test are done
.on('complete', function() {
    
    var str = '',
        fastest = this.filter('fastest').pluck('name').toString();

    $.each(this, function(i, bench) {
        
        str += '<table><tr><th colspan="2" class="name">' + bench.name + '</th></tr>';
        
        $.each('variance moe deviation sem rme mean sample'.split(' '), function(j, v) {

            str += '<tr><th>';

            str += v + '</th><td>'

            if (v == 'sample') str += bench.stats.sample.length;
            else str += bench.stats[v];

            str += '</td></tr>';
        });

        str += '</table>';
    });

    $('#status').toggleClass('running').html('Done! Fastest is <strong>' + fastest + '</strong>');
    
    $('#results').html(str + '</table>')
    .find('th.name').each(function() { 
        if ($(this).text() == fastest) $(this).parents('table').addClass('fastest');
    });

    $(':button:not(#abort)').removeProp('disabled');

    suite.reset();

});

// Some interface setups
$('#template').change(function() {
    test = $(this).val();
    
    doTemplate = $.doTemplate(tests[test].doTTemplate);
    tmpl = test;

    $('#doTTemplate').text(tests[test].doTTemplate + ' length: '+ tests[test].doTTemplate.length);
    $('#tmplTemplate').text(tests[test].tmplTemplate + ' length: '+ tests[test].tmplTemplate.length);
}).change();

$('#run').click(function() {
    resetDiv();
    firstrun = false;
    $('#iterationCount').text('');
    $('#results').empty();
    $('#status').html('Running...');
    $(':button:not(#abort)').prop('disabled', true);
    run();
});

$('#abort').click(function() {
    
    suite.abort();

    $('#status').html('Aborted by user.');
    $(':button').removeProp('disabled');

});
