Field = {};

Field.template = {
	extend: function(template) {
		template.defaults = {

		};
		template.setValue = function(value, templateInstance) {
			var params = templateInstance.params;
			var collection = resolveCollection(params.get('collection'));
			if(collection instanceof ReactiveDict) {
				return collection.set(params.get('name'), value);
			} else if(collection instanceof Mongo.Collection) {
				var doc = params.get('doc');
				if(doc != null) {
					var $set = {};
					$set[params.get('name')] = value;
					return collection.update(doc, {$set: $set});
				}
			}
		}
		template.getValue = function(templateInstance) {
			var params = templateInstance.params;
			var collection = resolveCollection(params.get('collection'));
			if(collection instanceof ReactiveDict) {
				return collection.get(params.get('name'));
			} else if(collection instanceof Mongo.Collection) {
				var doc = params.get('doc');
				if(doc != null) {
					return (collection.findOne(doc) || {})[params.get('name')];
				}
			}
		}
		template.helpers({
			'value': function() {
				var templateInstance = Template.instance();
				return template.getValue(templateInstance);
			},
			'serializedValue': function() {
				var templateInstance = Template.instance();
				return EJSON.stringify(template.getValue(templateInstance));
			}
		});
		template.events({

		});
		template.created = function() {
			//var args = _.toArray(arguments);
			var templateInstance = this;
			templateInstance.params = new ReactiveDict();
			var params = templateInstance.params;
			templateInstance.autorun(function() {
				var data = Template.currentData() || {};
				var parentData = Template.parentData(5) || {};
				_.each([
					'collection',
					'doc',
				], function(param) {
					params.set(param, resolve(data[param] || parentData[param] || template.defaults[param]));
				});
				params.set('name', resolve(data.name));
			});
		};
		template.rendered = function() {

		};
		template.destroyed = function() {
			var templateInstance = this;
		};
	}
}


var resolve = function(value) {
	if(_.isFunction(value)) return resolve(value());
	else return value;
}

var resolveCollection = function(name) {
	var collection = resolve(name);
	if(_.isString(collection) && window[collection]) {
		collection = window[collection];
	}
	if(!_.isObject(collection)) {
		collection = null;
	}
	return collection;
}

var inputTemplateName = function(data) {
	return data.template || (data.type || 'text')+'Field';
}

Template.field.helpers({
});

Template.fieldInput.helpers({
	'template' : function() {
		return inputTemplateName(this);
	}
});
