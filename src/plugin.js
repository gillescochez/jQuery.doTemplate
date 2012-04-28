$.fn.doTemplate = function(data) {

    if (data instanceof jQuery || data.nodeType) {
        return $.doTemplate({
            source:$(this).html(),
            data: $.doTemplate._(data).data
        });
    };

    // simply return a new doTemplate object
    return $.doTemplate({
        source: $(this).html(),
        data: data
    });
};
