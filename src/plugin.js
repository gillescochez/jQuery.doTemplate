$.fn.doTemplate = function(templateName, data, target) {

	// simply return a new doTemplate object
	return $.doTemplate({
		name: templateName,
		source: $(this).html(),
		target: target,
		data: data
	});
};