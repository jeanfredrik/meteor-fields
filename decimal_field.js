(function() {
	
	var template = Template.decimalField;
	
	var field = new FieldTemplate(template, {
		type: 'text',
		format: function(value) {
			return typeof value === 'number' ? numeral(value).format('0,0.00') : '';
		}
	});
	
	template.events({
		'keydown .input': function(event, templateInstance) {
			//console.log(event, this);
			var $target = $(event.target);
			if(jwerty.is('enter', event)) $target.trigger('enter');
			else if(jwerty.is('escape', event)) $target.trigger('escape');
		},
		'enter .input': function(event, templateInstance) {
			$(event.target).trigger('blur');
		},
		'escape .input': function(event, templateInstance) {
			var $target = $(event.target);
			var currentValue = template.fieldValue.call(this);
			$target.val(currentValue);
			$target.trigger('blur');
		},
		'focus .input-helper': function(event, templateInstance) {
			event.stopPropagation();
			$(templateInstance.firstNode).attr('data-editing', 'true');
			templateInstance.$('.input').trigger('focus');
		},
		'focus .input': function(event, templateInstance) {
			var $target = $(event.target);
		},
		'blur .input': function(event, templateInstance) {
			var $target = $(event.target);
			var newValue = $target.val();
			var currentValue = template.fieldValue.call(this);
			var context = templateInstance.data;
			//console.log(newValue, currentValue);
			$target.val(currentValue);
			if(newValue != currentValue && (!!newValue || !!currentValue)) {
				var modifier = {};
				modifier.$set = {};
				modifier.$set[field.field(context)] = newValue;
				field.save(context, modifier);
			}
			$(templateInstance.firstNode).removeAttr('data-editing');
		},
	});
	
})();