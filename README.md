## jQuery.doTemplate

$.doTemplate is a jQuery template plugin build around the high performance [doT](#credits) template engine, which is where the name come from and, well, it clearly state what it does too :)

It provides similar features than jQuery.tmpl but aims to provide a simplier API and better performance, butit doesn't allow you to store templates. 
However this is easily done as template object can be cached, reused and even served as base for a new template creation.

Best thing is to try it and make your own mind, hopefully there is enough below to help you get started :)

### Menu

* [Builder API](#builder-api)
* [Template API](#template-api)
* [Installation](#installation)
* [Examples](#examples)
* [Benchmarks](#benchmarks)
* [Credits](#credits)

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

The main rendering methods are appendTo, prependTo, insertAfter, insertBefore and replace and behave as you woudl expect. This [examples](#examples) for usage.

The render method is more of an internal helper for the methods stated above but it you want to save yourself a function call check the code to see how to use it.

### compiling new data

You can update an already created template by using the compile method and passing it the new data as seen below.

```javascript

var tmpl = $.doTemplate(templateString, data).appendTo('#target');
tmpl.compile(newData).appendTo('#target2'); // append the newly compiled data to a new element

```

## Installation

As you would expect any jquery plugin.

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
            <td class="click">{{= name }}</td>
            <td>{{= age }}</td>
            <td>{{= age >= 18 ? 'yes' : 'no' }}</td>
        </tr>
    </script>
    <script type="text/doTemplate" id="itemTemplate">
        <tr>
            <th colspan="3"><strong>{{= name }}</strong></th>
        </tr>
        <tr>
            <th>Age</th>
            <td colspan="2">{{= age }}</td>
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
    
    // grab the new source provider
    $('#itemTemplate')
    
    
    // here doTemplate will grab the doTemplate object store when the element, this, was created and compile its data with the new source
    // as it was in a loop this allow use to render a single row without any hassle
    .doTemplate(this)
    
    // we use the replace function to replace the old row
    .replace($(this).parent());
});

setTimeout(function() {
    
    // we update the template with the data and append that to another element
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

$.doTemplate('<p>{{= name }} : {{= age }}</p>', data).appendTo('#list');
	
```

### Benchmarks

Benchmarks are made using benchmark.js with a quickly put together interface to reports results and add the ability to run multiple
test in on go and be able to track which plugin was the fastest. If the result of benchmark.js is both are as fast then both plugin count
is increased (which mean the total of both can be higher than the number of iteration)

This is the only 2 line benchmarked so far.

```javascript

jquery.tmpl(templateString, data).appendTo(div);

$.doTemplate(templateString, data).appendTo(div);

```

So far jQuery.doTemplate is always faster than jquery.tmpl on FF, Chrome and IE9. 
Chrome and FF are tested on both windows and linux platform (chromium-browser on linux)

## Credits

The template engine is powered by [doT.js](http://olado.github.com/doT/), written by [Laura Doktorova](https://github.com/olado).
