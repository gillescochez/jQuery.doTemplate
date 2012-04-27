test('various', function() {

    var data = [
        {name: 'Paul', age: 22},
        {name: 'Edouard', age: 13},
        {name: 'Jesus', age: 33},
    ];

    ok($.doTemplate, 'exists');
    
    var templ = $('#listTemplate').doTemplate(data).appendTo('#list');

    $('td.click').live('click', function() {
        $('#itemTemplate').doTemplate($.doTemplate.get(this).data).replace($(this).parent());
    });

    setTimeout(function() {
            
        templ.compile([
            {name: 'Paulette', age: 69},
            {name: 'Jean', age: 18},
            {name: 'Turna', age: 17}
        ]).appendTo('#list2');
    
    }, 500);

});
