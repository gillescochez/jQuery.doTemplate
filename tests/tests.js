test('various', function() {

    var data = [
        {name: 'Paul', age: 22},
        {name: 'Edouard', age: 13},
        {name: 'Jesus', age: 33},
    ];

    ok($.doTemplate, 'exists');
    
    var templ = $('#listTemplate').doTemplate('list', data, '#list');

    $('td.click').live('click', function() {
        $('#itemTemplate').doTemplate('item',  $.doTemplate.get(this).dataObject, $(this).parent());
    });

    setTimeout(function() {
            
        templ.setTarget('#list2').setData([
            {name: 'Paulette', age: 69},
            {name: 'Jean', age: 18},
            {name: 'Turna', age: 17}
        ]).compile();
    
    }, 500);

});
