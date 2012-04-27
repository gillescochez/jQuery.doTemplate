var suite = new Benchmark.Suite;

// doTemplate test
suite.add('$.doTemplate', function() {
    </o/.test('Hello World!');
})

// tmpl test
.add('jQuery.tmpl', function() {
    'Hello World!'.indexOf('o') > -1;
})

// display result when all test are done
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})

// run async
.run({ 'async': true });
