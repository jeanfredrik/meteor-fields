var template = Template.textField;

Field.template.extend(template);



template.setValue = _.wrap(template.setValue, function(parent, value, templateInstance) {
	return parent.apply(this, _.rest(arguments));
});
template.getValue = _.wrap(template.getValue, function(parent, templateInstance) {
	return parent.apply(this, _.rest(arguments));
});

template.helpers({
	'attrs': function() {
		return _.defaults(_.omit(this.attrs || {}, ['value', 'class', 'name', 'type']), {
			
		});
	},
	'type': function() {
		return (this.attrs && this.attrs.type) || 'text';
	},
	'class': function() {
		return (this.attrs && this.attrs.class) || this.class;
	},
	'name': function() {
		return (this.attrs && this.attrs.name) || this.name;
	}
});
/*
template.created = _.wrap(template.created, function(parent) {
	parent.apply(this, _.rest(arguments));
});
template.destroyed = _.wrap(template.destroyed, function(parent) {
	parent.apply(this, _.rest(arguments));
});
*/
template.rendered = _.wrap(template.rendered, function(parent) {
	parent.apply(this, _.rest(arguments));
});
template.events({
	'input input': function(event, templateInstance) {
		//console.log(event.target, templateInstance);
		var value = $(event.target).val();
		//$(event.target).val(template.getValue(templateInstance));
		template.setValue(value, templateInstance);
		Tracker.flush();
	}
});
