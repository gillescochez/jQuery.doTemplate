var suite = new Benchmark.Suite,
    doTDiv = document.createElement('div'),
    tmplDiv = document.createElement('div'),
    data = [
        {name:'Paul', age: 12},
        {name:'Jean', age: 24}
    ],
    doTTemplate = '<p>{{= it.name }} {{ if (it.age < 18) { }} yes {{ } else { }} no {{ } }}</p>',
    tmplTemplate = '<p>${name} {{if age < 18}} yes {{else}} no {{/if}}</p>';

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
    
    var str = '<table>';

    $.each(this, function(i, bench) {
        
        str += '<tr><th colspan="2" class="name">' + bench.name + '</th></tr>';
        
        $.each('variance moe deviation sem rme mean sample'.split(' '), function(j, v) {

            str += '<tr><th>';

            str += v + '</th><td>'

            if (v == 'sample') str += bench.stats.sample.length;
            else str += bench.stats[v];

            str += '</td></tr>';
        });
    });

    $('#status').toggleClass('running').html('Done! Fastest is <strong>' + this.filter('fastest').pluck('name') + '</strong>');
    $('#results').html(str + '</table>');
});

$('#status').html('Running...');
$('#doTTemplate').text(doTTemplate);
$('#tmplTemplate').text(tmplTemplate);

setTimeout(function() {
    suite.run();
}, 100);
