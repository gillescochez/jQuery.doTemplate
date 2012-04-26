## jQuery.doTemplate

$.doTemplate is a jQuery template plugin build around the high performance doT template engine (see credits section). It provides similar features as the popular jquery.tmpl but aims
to provide an API that is easier to use and more self contained.

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

var templ = $('#listTemplate').doTemplate(data, '#list');

$('td.click').live('click', function() {
    $('#itemTemplate').doTemplate($.doTemplate.get(this).data, $(this).parent());
});

setTimeout(function() {
        
    templ.prop('target', '#list2').prop('data', [
        {name: 'Paulette', age: 69},
        {name: 'Jean', age: 18},
        {name: 'Turna', age: 17}
    ]).compile();

}, 500);

```

### Using strings as template

```javascript

var data = [
    {name: 'Paul', age: 22},
    {name: 'Edouard', age: 13},
    {name: 'Jesus', age: 33},
];

$.doTemplate('<p>{{= it.name }}</p>', data, '#list');
	
```


## Credits

The template engine is powered by [doT.js](http://olado.github.com/doT/), written by [Laura Doktorova](https://github.com/olado).
