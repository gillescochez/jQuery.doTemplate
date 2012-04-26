$.fn.doTemplate = function(data, target) {

    // simply return a new doTemplate object
    return $.doTemplate({
        source: $(this).html(),
        target: target,
        data: data
    });
};
