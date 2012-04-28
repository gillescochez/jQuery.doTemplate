$.fn.doTemplate = function(data, callback) {

    if (data instanceof jQuery || data.nodeType) {

        if (data instanceof jQuery) data = data[0];

        return $.doTemplate({
            source:$(this).html(),
            data: $.doTemplate._(data).data
        });
    };

    // simply return a new doTemplate object
    return $.doTemplate({
        source: $(this).html(),
        data: data,
        complete: callback
    });
};
