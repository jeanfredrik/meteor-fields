(function() {
	
	var template = Template.categoryField;
	
	/*
	var field = new FieldTemplate(template, {
		type: 'text',
	});
	*/
	
	template.rendered = _.wrap(template.rendered, function(fn) {
		console.log(fn);
		this.inputHelperValue = '';
		this.inputHelperValueDep = new Deps.Dependency;
		fn.call(this);
	});
	
	template.helpers({
		'fieldOptions': function() {
			console.log(this);
			var templateInstance = UI._templateInstance();
			if(_.isFunction(this.options)) {
				templateInstance.inputHelperValueDep.depend();
				return this.options(templateInstance.inputHelperValue);
			}
		}
	})
	/*
	template.fieldOptions = function() {
		console.log(this);
		var templateInstance = UI._templateInstance();
		if(_.isFunction(this.options)) {
			templateInstance.inputHelperValueDep.depend();
			return this.options(templateInstance.inputHelperValue);
		}
	}
	*/
	
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
			$(templateInstance.firstNode).attr('data-editing', 'true');
			templateInstance.$('.input').trigger('focus');
		},
		'input .input-helper': function(event, templateInstance) {
			var newValue = $(event.target).val();
			if(newValue != templateInstance.inputHelperValue) {
				templateInstance.inputHelperValue = newValue;
				templateInstance.inputHelperValueDep.changed();
			}
		},
		'focus .input': function(event, templateInstance) {
			var $target = $(event.target);
		},
		'blur .input': function(event, templateInstance) {
			var $target = $(event.target);
			var newValue = $target.val();
			var currentValue = template.fieldValue.call(this);
			var context = templateInstance.data;
			$target.val(currentValue);
			if(newValue != currentValue) {
				var modifier = {};
				modifier.$set = {};
				modifier.$set[field.field(context)] = newValue;
				field.save(context, modifier);
			}
			$(templateInstance.firstNode).removeAttr('data-editing');
		},
	});
	
})();