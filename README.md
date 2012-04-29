## jQuery.doTemplate

$.doTemplate is a jQuery template plugin build around the high performance [doT](#credits) template engine, which is where the name come from and, well, it clearly state what it does too :)

It provides similar features than jQuery.tmpl but aims to provide a simplier API and has better performance than the former, also it's template syntax is different and it doesn't allow you
to store templates. However this is easily done as template object can be cached, reused and even served as base for a new template creation.

### Menu

* [Features doT](#features-dot)
* [Settings doT](#settings-dot)
* [Builder API](#builder-api)
* [Template API](#template-api)
* [Installation](#installation)
* [Examples](#examples)
* [Benchmarks](#benchmarks)
* [Credits](#credits)

## Features doT

* custom delimiters
* runtime evaluation
* runtime interpolation
* compile-time evaluation
* partials support
* encoding
* conditionals
* array iteration
* control whitespace - strip or preserve
* streaming friendly

view the [doT examples](https://github.com/olado/doT/tree/master/examples) to see advanced template syntax

## Settings doT

All the settings exposed are used by the doT and allows you to customize the template engine.
You can set your own delimiters by updating the regex expressions.

```javascript

$.doTemplate.settings = {
    evaluate: /\{\{([\s\S]+?)\}\}/g, // {{ }}
    interpolate: /\{\{=([\s\S]+?)\}\}/g, // {{= }}
    encode: /\{\{!([\s\S]+?)\}\}/g, // {{! }}
    use: /\{\{#([\s\S]+?)\}\}/g, // {{# }}
    define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g, // {{## }}
    varname: 'it', // e.g. {{= it.name }}
    strip : true, // strip white space
    append: true
};

```

## Builder API

### jQuery.doTemplate();

The core function that serve new template object based on arguments provided.

```javascript

    // pass source and data as arguments
    $.doTemplate('<p>{{= it.name }}</p>', [{name:'John'},{name:'Jack'}]).appendTo('#names');

    // or

    // pass a configuration object
    $.doTemplate({
        data: [{name:'John'},{name:'Jack'}],
        source: '<p>{{= it.name }}</p>',
    })
    .appendTo('#names');

    // or if you want a template object based of the template object used to render an element

    $.doTemplate(element);

    // if a source is passed first it will be used instead of the original template
    $.doTemplate('<div>{{= it.name }}</div>', element).appendTo('#itemId');


```

### jQuery().doTemplate();

This is an helper function which return a template object created using the element contents

```javascript

    
    // passing data as argument
    $('#template').doTemplate([{name:'John'},{name:'Jack'}]).appendTo('#names');

    // or to create a new template using the element source as new source
    $('#template2').doTemplate(element);

```

## Template API

The template builder methods return a template object. That object has an API to simplify the rendering of compiled
content in the document.

### rendering methods

appendTo, prependTo, insertAfter, insertBefore and replace can be used to insert the compiled source into the DOM

### compiling new data

```javascript

var tmpl = $.doTemplate(templateString, data).appendTo('#target');
tmpl.compile(newData).appendTo('#target2'); // append the newly compiled data to a new element

```

## Installation

```html

<script src="jquery.min.js"></script>
<script src="jquery.doTemplate.min.js"></script>

```

## Examples

### Using script tags to store templates

```html

<head>
    <script type="text/doTemplate" id="listTemplate">
        <tr>
            <td class="click">{{= it.name }}</td>
            <td>{{= it.age }}</td>
            <td>{{= it.age >= 18 ? 'yes' : 'no' }}</td>
        </tr>
    </script>
    <script type="text/doTemplate" id="itemTemplate">
        <tr>
            <th colspan="3"><strong>{{= it.name }}</strong></th>
        </tr>
        <tr>
            <th>Age</th>
            <td colspan="2">{{= it.age }}</td>
        </tr>
    </script>
</head>
<body>
<h1>List 1</h1>
<table>
    <thead>
        <tr><th>Name</th><th>Age</th><th>Adult</th></tr>
    </thead>
    <tbody id="list"></tbody>
</table>
<h2>List 2</h1>
<table>
    <thead>
        <tr><th>Name</th><th>Age</th><th>Adult</th></tr>
    </thead>
    <tbody id="list2"></tbody>
</table>
</body>
```

```javascript

var data = [
    {name: 'Paul', age: 22},
    {name: 'Edouard', age: 13},
    {name: 'Jesus', age: 33},
];

var templ = $('#listTemplate').doTemplate(data).appendTo('#list');

$('td.click').live('click', function() {
    $('#itemTemplate').doTemplate(this).replace($(this).parent());
});

setTimeout(function() {
        
    templ.compile([
        {name: 'Paulette', age: 69},
        {name: 'Jean', age: 18},
        {name: 'Turna', age: 17}
    ]).appendTo('#list2');

}, 500);

```

### Using strings as template

```javascript

var data = [
    {name: 'Paul', age: 22},
    {name: 'Edouard', age: 13},
    {name: 'Jesus', age: 33},
];

$.doTemplate('<p>{{= it.name }} : {{= it.age }}</p>', data).appendTo('#list');
	
```

### Benchmarks

Benchmarks are made using benchmark.js with a quickly put together interface to reports results and add the ability to run multiple
test in on go and be able to track which plugin was the fastest. If the result of benchmark.js is both are as fast then both plugin count
is increased (which mean the total of both can be higher than the number of iteration)

The results below are the results optain by running 10,000 time the suite in each browser and counting the number of time where the plugin
was returned as the fastest. This took a while to run, but the iteration count can be updated if you wanna play around :)

#### Firefox

#### Chrome

#### Safari

#### Internet Explorer

Of course for this one needed to test multiple version

##### IE9

???

##### IE8

???

##### IE7

???

##### IE6

???

## Credits

The template engine is powered by [doT.js](http://olado.github.com/doT/), written by [Laura Doktorova](https://github.com/olado), this is why jQuery.doTemplate is so fast.
