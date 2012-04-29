var suite = new Benchmark.Suite,
    doTDiv, tmplDiv,
    iteration, iterationNb,
    count = {
        'jQuery.doTemplate': 0,
        'jQuery.tmpl': 0
    },
    single = true,
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
            data: {name:'a'},
            doTTemplate: '{{= it.name }}',
            tmplTemplate: '${name}'
        },
        normal: {
            data:[
                {name:'Paul', age:16},
                {name:'Jean', age:20},
                {name:'Henri', age:30},
                {name:'Simon', age:60}
            ],
            doTTemplate: '<p>{{= it.name }} {{ if (it.age < 18) { }} yes {{ } else { }} no {{ } }}</p>',
            tmplTemplate: '<p>${name} {{if age < 18}} yes {{else}} no {{/if}}</p>'
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
            doTTemplate:'',
            tmplTemplate:''
        }
    },
    test = 'simple';

// doTemplate test
suite.add('jQuery.doTemplate', function() {
   $.doTemplate(tests[test].doTTemplate, tests[test].data).appendTo(doTDiv);
})

// tmpl test
.add('jQuery.tmpl', function() {
    $.tmpl(tests[test].tmplTemplate, tests[test].data).appendTo(tmplDiv);
})

// display result when all test are done
.on('complete', function() {
    
    var str = '',
        fastest = this.filter('fastest').pluck('name').toString();

    if (single) {

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

    } else {

        iterationNb++;

        if (fastest.indexOf('jQuery.doTemplate') !== -1) count['jQuery.doTemplate']++;
        if (fastest.indexOf('jQuery.tmpl') !== -1) count['jQuery.tmpl']++;

        str += '<table>';

        $.each(count, function(k, v) {
            str += '<tr><th class="name">' + k+ '</th><td>' + v + '</td></tr>';
        });

        str += '</table>';

        $('#results').html(str);

        if (iteration !== iterationNb) {
            
            resetDiv();
            suite.reset();

            // give the system a quick reset before running again
            setTimeout(function() {
                run();
            }, 5000);
        } else {
            $('#status').html('Done!');
            $(':button:not(#abort)').removeProp('disabled');
        };
    };
});

// Some interface setups
$('#doTTemplate').text(doTTemplate);
$('#tmplTemplate').text(tmplTemplate);

$('#template').change(function() {
    test = $(this).val();
    $('#doTTemplate').text(tests[test].doTTemplate);
    $('#tmplTemplate').text(tests[test].tmplTemplate);
}).change();

$('#run').click(function() {
    resetDiv();
    single = true;
    $('#iterationCount').text('');
    $('#results').empty();
    $('#status').html('Running...');
    $(':button:not(#abort)').prop('disabled', true);
    run();
});

$('#batch').click(function() {
    
    single = false;
    
    iteration = parseInt($('#iteration').val());
    iterationNb = 0;

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
