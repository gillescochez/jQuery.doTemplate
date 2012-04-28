## jQuery.doTemplate

$.doTemplate is a jQuery template plugin build around the high performance doT template engine (see credits section). It provides similar features as the popular jquery.tmpl but aims
to provide an API that is easier to use. Also it doesn't store templates for you, but as each template is an object that can be reuse you can easily cache them. That decision was made
to unify the API as you can see below

## Template builder API

### $.doTemplate();

The core function that serve new template object based on arguments provided.

examples

```javascript

    // pass source and data as arguments
    $.doTemplate('<p>{{= $it.name }}</p>', [{name:'John'},{name:'Jack'}]).appendTo('#names');

    // or

    // pass a configuration object
    $.doTemplate({
        data: [{name:'John'},{name:'Jack'}],
        source: '<p>{{= $it.name }}</p>',
        complete: function() {
            this.appendTo('#names');
        }
    });

    // or if you want a template object based of the template object used to render an element

    $.doTemplate(element);

    // if a source is passed first it will be used instead of the original template
    $.doTemplate('<div>{{= $it.name }}</div>', element);


```


### $().doTemplate();

This is an helper function which return a template object created using the element contents

examples

```javascript

    
    // passing data as argument
    $('#template').doTemplate([{name:'John'},{name:'Jack'}]).appendTo('#names');

    // or

    // passing a confi object
    $('#template').doTemplate({
        data: [{name:'John'},{name:'Jack'}],
        complete: function() {
            this.appendTo('#names');
        }
    });

    // or to create a new template using the element source as new source
    $('#template2').doTemplate(element);

```

## Template object API

The template builder methods return a template object. That object has an API to simplify the rendering of compiled
content in the document.

### rendering methods

appendTo, prependTo, insertAfter, insertBefore and replace can be used to insert the compiled source into the DOM

### compiling new data

example tmpl.compile([Data Onject]).appendTo('#target');

## Usage

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

$.doTemplate('<p>{{= it.name }}</p>', data).appendTo('#list');
	
```


## Credits

The template engine is powered by [doT.js](http://olado.github.com/doT/), written by [Laura Doktorova](https://github.com/olado).
