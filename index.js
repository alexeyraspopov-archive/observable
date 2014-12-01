'use strict';
var newsletter = require('newsletter');

function observable(value){
	var cell, subscription = newsletter();

	cell = function(newValue){
		if(arguments.length){
			value = newValue;
			subscription.publish(value);
		}

		return value;
	};

	cell.subscribe = subscription.subscribe;

	cell.bind = function(continuation){
		cell.subscribe(continuation);
		continuation(value);

		return continuation;
	};

	cell.map = function(morphism){
		var mapped = observable(morphism(value));

		cell.subscribe(function(value){
			return mapped(morphism(value));
		});

		return mapped;
	};

	cell.filter = function(predicate){
		var filtered = predicate(value) ? observable(value) : observable();

		cell.subscribe(function(value){
			return predicate(value) && filtered(value);
		});

		return filtered;
	};

	cell.toString = function(){
		return 'Observable(' + value + ')';
	};

	return cell;
}

module.exports = observable;
