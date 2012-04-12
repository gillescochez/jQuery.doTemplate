## jQuery.doTemplate

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

```

```javascript

var data = [
	{name: 'Paul', age: 22},
	{name: 'Edouard', age: 13},
	{name: 'Jesus', age: 33},
];

var templ = $('#listTemplate').doTemplate('list', data, '#list');

$('td.click').live('click', function() {
	$('#itemTemplate').doTemplate('item',  $.doTemplate.get(this).dataObject, this);
});

setTimeout(function() {
	
	templ.setTarget('#list2').setData([
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

$.doTemplate('list', '<p>{{= it.name }}</p>', data, '#list');
	
```


## Credits

The template engine is powered by [doT.js](http://olado.github.com/doT/), written by [Laura Doktorova](https://github.com/olado).