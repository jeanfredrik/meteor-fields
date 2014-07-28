(function() {
	
	FieldTemplate = function(template, defaults) {
		var self = this;
		_.extend(template, {
			rendered: function() {
				//console.log(this.data);
				var context = this.data;
				if(context.mask) this.$('.input').mask(context.mask, (function() {
					var result = {
						reverse: context.maskReverse,
					}
					//console.log(result);
					return result;
				})());
			},
			field: function() {
				return self.field(this);
			},
			fieldName: function() {
				return this.name;
			},
			fieldType: function() {
				return this.type || defaults.type;
			},
			fieldValue: function() {
				var value = self.value(this);
				if(_.isDate(value)) {
					value = moment(value).format('YYYY-MM-DD');
				}
				return value;
			},
			defaults: defaults,
			inputAttrs: function() {
				return _.omit(this, [
					'autosave',
					'name',
					'collection',
					'doc',
					'field',
					'value',
					'mask',
					'maskReverse',
				]);
			},
			fieldValueFormatted: function() {
				//console.log(self.format(this), self.value(this), this, self.format(this)(self.value(this)))
				return self.format(this)(self.value(this));
			},
		});
		this.defaults = defaults;
	};
	_.extend(FieldTemplate.prototype, {
		//_privateCollection: null,
		privateCollection: function() {
			return this._privateCollection || (this._privateCollection = new Meteor.Collection(null));
		},
		collection: function(context) {
			var collection = _.unwrap(context.collection);
			switch(typeof collection) {
				case 'string':
				return window[collection];
				break;
				
				case 'object':
				return collection;
				break;
			}
		},
		docId: function(context) {
			var doc = _.unwrap(context.doc);
			switch(typeof doc) {
				case 'string':
				return doc;
				break;
				
				case 'object':
				return doc._id;
				break;
			}
		},
		doc: function(context) {
			var doc = _.unwrap(context.doc);
			switch(typeof doc) {
				case 'string':
				return this.collection(context).findOne(doc);
				break;
				
				case 'object':
				return doc;
				break;
			}
		},
		value: function(context) {
			var doc = this.doc(context);
			return _.unwrap.call(doc, doc[this.field(context)]);
		},
		field: function(context) {
			return _.unwrap(context.field || context.name);
		},
		save: function(context, modifier) {
			var collection = this.collection(context);
			var docId = this.docId(context);
			collection.update(docId, modifier);
		},
		format: function(context) {
			return context.format || this.defaults.format || _.identity;
		}
	});
	
})();