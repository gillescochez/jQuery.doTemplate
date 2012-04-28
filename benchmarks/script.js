var suite = new Benchmark.Suite,
    div = document.createElement('div'),
    tmp = document.createElement('div'),
    data = [
        {name:'Paul', age: 12},
        {name:'Jean', age: 24}
    ],
    doTTemplate = '<p>doTemplate: {{= it.name }} : {{= it.age < 18 ? "yes" : "no" }}</p>',
    tmplTemplate = '<p>tmpl: ${name} : {{if age < 18}}yes{{else}}no{{/if}}</p>',
    target = document.getElementById('target');

// doTemplate test
suite.add('$.doTemplate', function() {
   $.doTemplate({
        source: doTTemplate, 
        data:data
    }).appendTo(div);
})

// tmpl test
.add('jQuery.tmpl', function() {
    $.tmpl(tmplTemplate, data).appendTo(div);
})

// display result when all test are done
.on('complete', function() {
    
    var str = '<p>';

    $.each(this, function(i, bench) {
        
        str += '<strong>' + bench.name + '</strong><br /><br />';
        
        $.each(bench.stats, function(k, v) {

            str += k + ': '

            if (k == 'sample') str += v.length;
            else str += v;

            str += '<br />';
        });

        str += '</p>';
    });

    document.getElementById('status').innerHTML = 'Done! Fastest is ' + this.filter('fastest').pluck('name');
    document.getElementById('results').innerHTML = str;
});

target.innerHTML = '<h1>Benchamarks</h1>\
<h2>$.doTemplate vs $.tmpl</h2>\
<p id="status">Runing...</p>\
<p id="results"></p>';

setTimeout(function() {
    suite.run();
}, 100);
