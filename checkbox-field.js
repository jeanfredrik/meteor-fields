var template = Template.checkboxField;

Field.template.extend(template);



template.setValue = _.wrap(template.setValue, function(parent, value, templateInstance) {
	return parent.apply(this, _.rest(arguments));
});
template.getValue = _.wrap(template.getValue, function(parent, templateInstance) {
	return parent.apply(this, _.rest(arguments));
});

template.helpers({
	'attrs': function() {
		return {
			type: 'checkbox'
		};
	}
});
/*
template.destroyed = _.wrap(template.destroyed, function(parent) {
	parent.apply(this, _.rest(arguments));
});
template.created = _.wrap(template.created, function(parent) {
	parent.apply(this, _.rest(arguments));
});
*/
template.rendered = _.wrap(template.rendered, function(parent) {
	parent.apply(this, _.rest(arguments));
	var templateInstance = this;
	var params = templateInstance.params;
	templateInstance.autorun(function() {
		var value = template.getValue(templateInstance);
		templateInstance.$(':checkbox').prop('checked', !!value);
	});
});
template.events({
	'change input': function(event, templateInstance) {
		//console.log(event.target, templateInstance);
		var value = $(event.target).prop('checked');
		//$(event.target).val(template.getValue(templateInstance));
		template.setValue(value, templateInstance);
		Tracker.flush();
	}
});
