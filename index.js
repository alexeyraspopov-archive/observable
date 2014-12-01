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
		var mapped = observable();

		cell.subscribe(function(value){
			return mapped(morphism(value));
		});

		return mapped;
	};

	cell.filter = function(predicate){
		var filtered = observable();

		if(typeof value !== 'undefined' && predicate(value)){
			filtered(value);
		}

		cell.subscribe(function(value){
			return predicate(value) && filtered(value);
		});

		return filtered;
	};

	cell.concat = function(another){
		// todo: bind?
		var merged = observable(value);

		cell.subscribe(merged);
		another.subscribe(merged);

		return merged;
	};

	cell.reduce = function(reducer, initial){
		var reduced = observable(initial);

		cell.map(function(value){
			return reducer(reduced(), value);
		}).subscribe(reduced);

		return reduced;
	};

	cell.toString = function(){
		return 'Observable(' + value + ')';
	};

	return cell;
}

module.exports = observable;
