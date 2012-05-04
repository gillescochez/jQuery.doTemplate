# jQuery.doTemplate

doTemplate is a jQuery template plugin build around the high performance [doT](#credits) template engine, which is where the name come from and, well, it clearly state what it does too :)

It provides similar features than jQuery.tmpl but aims to provide a simplier API and similar performances.

Best thing is to try it and make your own mind, hopefully there is enough below to help you get started :)

# Menu

* [Builder API](#builder-api)
* [Template API](#template-api)
* [Installation](#installation)
* [Template tags](#template-tags)
* [Examples](#examples)
* [Benchmarks](#benchmarks)
* [Credits](#credits)

# Builder API

## jQuery.doTemplate();

The core function that serve new template object based on arguments provided.

```javascript

    // pass source and data as arguments
    $.doTemplate('<p>${name}</p>', [{name:'John'},{name:'Jack'}]).appendTo('#names');

    // or

    // pass a configuration object
    $.doTemplate({
        data: [{name:'John'},{name:'Jack'}],
        source: '<p>${name}</p>',
    })
    .appendTo('#names');

    // or if you want a template object based of the template object used to render an element

    $.doTemplate(element);

    // if a source is passed first it will be used instead of the original template
    $.doTemplate('<div>${name}</div>', element).appendTo('#itemId');


```

## jQuery().doTemplate();

This is an helper function which return a template object created using the element contents

```javascript

    
    // passing data as argument
    $('#template').doTemplate([{name:'John'},{name:'Jack'}]).appendTo('#names');

    // or to create a new template using the element source as new source
    $('#template2').doTemplate(element);

```

# Template API

The template builder methods return a template object. That object has an API to simplify the rendering of compiled
content in the document.

## rendering methods

The main rendering methods are appendTo, prependTo, insertAfter, insertBefore and replace and behave as you would expect them to. 
See the [examples](#examples) for usage (append and replace are used)

The render method is more of an internal helper for the methods stated above but it you want to save yourself a function call check the code to see how to use it.

## compiling new data

You can update an already created template by using the compile method and passing it the new data as seen below.

```javascript

var tmpl = $.doTemplate(templateString, data).appendTo('#target');
tmpl.compile(newData).appendTo('#target2'); // append the newly compiled data to a new element

```

# Installation

As you would expect any jquery plugin.

```html
<script src="jquery.min.js"></script>
<script src="jquery.doTemplate.min.js"></script>
```


# Template tags

Templates tags are used to insert logic into your templates.

## Interpolation tag

Print out data value. This can be done using the short or long tag.

If you use the long tag and disable the shorttag usage it will increase performance slightly as the engine convert the short into long before processing it.

```html
Short tag: ${var}
Long tag: {{=var}}

Accessing Array: ${array[0]}
Accessing Object: ${object.foo}

Conditional: ${isRed ? 'red' : 'white'}
```

## Conditional statement tag

The conditional statement tags allows you to create if / else like statetement inside your templates

```html
If / Else

{{? red}}
    do something
{{??}}
    do something else
{{?}}

If / Elseif / Else

{{? red}}
    do something
{{?? blue}}
    do something else
{{??}}
    do something else
{{?}}
```

## Iteration tag

The iteration tags can be used to loop through arrays and objects from the template file. Iteration tags can be nested.

```html
<ul>
    {{~ items :item }}
        {{~ item :link }}
            <li><a href="${link.href}" title="${link.title}">${link.label}</a></li>
        {{~}}
    {{~}}
</ul>
```

## Evaluation tag

The evaluation tag allows you to run pure javascript inside your template.

```html

{{ if (red) { }}
    red
{{ } else { }}
    white
{{ } }}

```

## Enconding tag

The encoding tag will encode its body so everything is render as it is inside the browser (useful to print out html code)

```
{{! The tag <strong> is strong }}

```

# Examples

## Using script tags to store templates

```html
<head>
    <script type="text/doTemplate" id="listTemplate">
        <tr>
            <td class="click">${name}</td>
            <td>${age}</td>
            <td>${age >= 18 ? 'yes' : 'no'}</td>
        </tr>
    </script>
    <script type="text/doTemplate" id="itemTemplate">
        <tr>
            <th colspan="3"><strong>${name}</strong></th>
        </tr>
        <tr>
            <th>Age</th>
            <td colspan="2">${age}</td>
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
    // as it was in a loop this allow us to render a single row without any hassle
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

## Using strings as template

```javascript
var data = [
    {name: 'Paul', age: 22},
    {name: 'Edouard', age: 13},
    {name: 'Jesus', age: 33},
];

$.doTemplate('<p>${name} : ${age}</p>', data).appendTo('#list');	
```
# Benchmarks

Benchmarks are made using benchmark.js and for the moment are quite simple.

jQuery.templ and jQuery.doTemplate are both being tested with the template function cached so that the result analyse only
the compiling data and insertion performance (using appendTo)

Only 3 template strings are test for now:

* basic interpolation using the short tag
* basic conditional statement
* basic iteration

The results varies depending on the platform and the browser used, in Linux jQuery.doTemplate is the winner, on Windows it really varies
depending on the browser used. Here again the best thing is to run the benchmarks in the browser you use and see what you get.

# Credits

The template engine is powered by [doT.js](http://olado.github.com/doT/), written by [Laura Doktorova](https://github.com/olado).
