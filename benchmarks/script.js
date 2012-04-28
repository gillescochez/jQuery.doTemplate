var suite = new Benchmark.Suite,
    doTDiv = document.createElement('div'),
    tmplDiv = document.createElement('div'),
    data = [
        {name:'Paul', age: 12},
        {name:'Jean', age: 24}
    ],
    doTTemplate = '<p>{{= it.name }} {{ if (it.age < 18) { }} yes {{ } else { }} no {{ } }}</p>',
    tmplTemplate = '<p>${name} {{if age < 18}} yes {{else}} no {{/if}}</p>',
    iteration, iterationNb,
    count = {
        'jQuery.doTemplate': 0,
        'jQuery.tmpl': 0
    },
    single = true,
    async = {async:true},
    resetDiv = function() {
        doTDiv = document.createElement('div');
        tmplDiv = document.createElement('div');
    };

// doTemplate test
suite.add('jQuery.doTemplate', function() {
   $.doTemplate({
        source: doTTemplate, 
        data:data
    }).appendTo(doTDiv);
})

// tmpl test
.add('jQuery.tmpl', function() {
    $.tmpl(tmplTemplate, data).appendTo(tmplDiv);
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

        resetDiv();

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

            // give the system a quick reset before running again
            setTimeout(function() {
                suite.reset();
                suite.run(async);
            }, 2000);
        } else {
            $('#status').html('Done!');
            $(':button:not(#abort)').removeProp('disabled');
        };
    };
});

$('#doTTemplate').text(doTTemplate);
$('#tmplTemplate').text(tmplTemplate);

$('#run').click(function() {
    single = true;
    $('#iterationCount').text('');
    $('#results').empty();
    $('#status').html('Running...');
    $(':button:not(#abort)').prop('disabled', true);
    suite.run(async);

});

$('#batch').click(function() {
    
    single = false;
    
    iteration = parseInt($('#iteration').val());
    iterationNb = 0;

    $('#results').empty();
    $('#status').html('Running...');
    $(':button:not(#abort)').prop('disabled', true); 
    suite.run(async);
});

$('#abort').click(function() {
    
    suite.abort();

    $('#status').html('Aborted by user.');
    $(':button').removeProp('disabled');

});
