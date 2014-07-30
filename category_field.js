(function() {
	
	var template = Template.categoryField;
	
	var field = new FieldTemplate(template, {
		type: 'text',
	});
	
	optionListTemplateHelpers = {
		value: function() {
			return helperValue(this.parentGuid);
		},
		hasFocus: function() {
			return helperHasFocus(this.parentGuid);
		}
	}
	
	formattedValueTemplateHelpers = {
		data: function() {
			return formattedValueContext(this.parentGuid);
		}
	}
	
	var _helperValues = {};
	var _helperValuesDeps = {};
	var helperValue = function(guid, value) {
		if(value === undefined) {
			(_helperValuesDeps[guid] || (_helperValuesDeps[guid] = new Deps.Dependency)).depend();
			return _helperValues[guid];
		} else {
			_helperValues[guid] = value;
			(_helperValuesDeps[guid] || (_helperValuesDeps[guid] = new Deps.Dependency)).changed();
		}
	}
	
	var _helperFocusGuid = 'none';
	var _helperFocusDeps = {};
	var helperSetFocus = function(guid) {
		guid = guid || 'none';
		var prevValue = _helperFocusGuid;
		_helperFocusGuid = guid;
		(_helperFocusDeps[prevValue] || (_helperFocusDeps[prevValue] = new Deps.Dependency)).changed();
		(_helperFocusDeps[guid] || (_helperFocusDeps[guid] = new Deps.Dependency)).changed();
	}
	var helperHasFocus = function(guid) {
		guid = guid || 'none';
		(_helperFocusDeps[guid] || (_helperFocusDeps[guid] = new Deps.Dependency)).depend();
		return _helperFocusGuid == guid;
	}
	
	var _formattedValueContexts = {};
	var _formattedValueContextsDeps = {};
	var formattedValueContext = function(guid, value) {
		if(value === undefined) {
			(_formattedValueContextsDeps[guid] || (_formattedValueContextsDeps[guid] = new Deps.Dependency)).depend();
			return _formattedValueContexts[guid];
		} else {
			_formattedValueContexts[guid] = value;
			(_formattedValueContextsDeps[guid] || (_formattedValueContextsDeps[guid] = new Deps.Dependency)).changed();
		}
	}
	
	template.fieldValueFormatted = function() {
		return this.formattedValue.call(this);
	}
	
	template.formattedValueContext = function() {
		return {
			value: template.fieldValue.call(this)
		}
	}
	
	template.rendered = _.wrap(template.rendered, function(fn) {
		fn.call(this);
		var templateInstance = this;
		var guid = templateInstance.__component__.guid;
		helperValue(guid, '');
		
		var optionListTemplate = templateInstance.data.optionList;
		var optionsListContainer = templateInstance.$('.option-list-container')[0];
		_.defaults(optionListTemplate, optionListTemplateHelpers);
		UI.insert(
			UI.renderWithData(
				optionListTemplate,
				{
					parentGuid: guid
				}
			),
			optionsListContainer
		);
		
		/*
		var formattedValueTemplate = templateInstance.data.formattedValue;
		var formattedValueContainer = templateInstance.$('.formatted-value-container')[0];
		_.defaults(formattedValueTemplate, formattedValueTemplateHelpers);
		UI.insert(
			UI.renderWithData(
				formattedValueTemplate,
				{
					parentGuid: guid
				}
			),
			formattedValueContainer
		);
		*/
		
		Deps.autorun(function() {
			helperValue(guid); helperHasFocus(guid);
			Meteor.defer(function() {
				$('.option', optionsListContainer).removeClass('active').first().addClass('active');
			});
		});
	});
	
	template.events({
		'focus .input-formatted': function(event, templateInstance) {
			event.stopPropagation();
			var guid = templateInstance.__component__.guid;
			$(templateInstance.firstNode).attr('data-editing', 'true');
			helperSetFocus(guid);
			templateInstance.$('.input-helper').val(_.trim($(event.target).text())).trigger('input').trigger('focus')[0].select();
		},
		'input .input-helper': function(event, templateInstance) {
			var guid = templateInstance.__component__.guid;
			var newValue = $(event.target).val();
			//console.log(newValue)
			helperValue(guid, newValue);
		},
		'blur .input-helper': function(event, templateInstance) {
			var guid = templateInstance.__component__.guid;
			helperSetFocus('none');
			$(templateInstance.firstNode).removeAttr('data-editing');
		},
		'keydown .input-helper': function(event, templateInstance) {
			//console.log(event, this);
			var optionsListContainer = templateInstance.$('.option-list-container')[0];
			var $target = $(event.target);
			if(jwerty.is('enter', event)) {
				$target.trigger('accept');
				$target.trigger('blur');
			} else if(jwerty.is('tab', event)) {
				$target.trigger('accept');
			} else if(jwerty.is('escape', event)) $target.trigger('escape');
			else if(jwerty.is('arrow-down', event)) {
				var index = $('.option.active', optionsListContainer).removeClass('active').index();
				$('.option', optionsListContainer).eq(index+1).addClass('active');
			} else if(jwerty.is('arrow-up', event)) {
				var index = $('.option.active', optionsListContainer).removeClass('active').index();
				if(index > 0) $('.option', optionsListContainer).eq(index-1).addClass('active');
				else if(index == -1) $('.option', optionsListContainer).last().addClass('active')
			} else if(jwerty.is('home', event)) {
				$('.option.active', optionsListContainer).removeClass('active');
				$('.option', optionsListContainer).first().addClass('active');
			} else if(jwerty.is('end', event)) {
				$('.option.active', optionsListContainer).removeClass('active');
				$('.option', optionsListContainer).last().addClass('active');
			};
			//console.log(UI.getElementData($('.option.active', optionsListContainer)[0]));
		},
		'escape .input-helper': function(event, templateInstance) {
			var $target = $(event.target);
			$target.trigger('blur');
		},
		'accept .input-helper': function(event, templateInstance) {
			var optionsListContainer = templateInstance.$('.option-list-container')[0];
			var $target = $(event.target);
			var elementData;
			var newValue = (elementData = UI.getElementData($('.option.active', optionsListContainer)[0])) && elementData._id;
			var currentValue = template.fieldValue.call(this);
			var context = templateInstance.data;
			$target.val(currentValue);
			//console.log(currentValue, newValue);
			if(newValue != currentValue) {
				var modifier = {};
				modifier.$set = {};
				modifier.$set[field.field(context)] = newValue;
				field.save(context, modifier);
			}
		},
		'mousedown .option': function(event, templateInstance) {
			var optionsListContainer = templateInstance.$('.option-list-container')[0];
			$('.option.active', optionsListContainer).removeClass('active');
			$(event.target).addClass('active').closest('[data-field]').find('.input-helper').trigger('accept');
		},
	});
	
})();
