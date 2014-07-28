_.mixin({
	'unwrap': function(value) {
    return _.isFunction(value) ? _.unwrap(value.call(this)) : value;
	}
});