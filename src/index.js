//
// Interval Clock Tree
// Based on P.S. Almeida et al., DI/CCTC, Universidade do Minho, Braga, Portugal, 2008
// Copyright (c) 2015 Bastiaan Marinus van de Weerd. All Rights Reserved.
//


function ITC(identifier, event) {
	this._identifier = identifier ? identifier : new this.constructor.Identifier();
	this._event = event ? event : new this.constructor.Event();
};


ITC.join = function joinITCs(itcA, itcB) {
	itcA = itcA != null ? itcA : new this();
	itcB = itcB != null ? itcB : new this();
	var id = this.Identifier.join(itcA._identifier, itcB._identifier),
	    ev = this.Event.join(itcA._event, itcB._event);
	return new this(id, ev);
};

ITC.event = function eventITC(itc) {
	itc = itc != null ? itc : new this();
	var id = itc._identifier,
	    ev = this.Event.event(itc._event, id);
	return new this(id, ev);
};

ITC.fork = function forkITC(itc) {
	itc = itc != null ? itc : new this();
	var ids = this.Identifier.fork(itc._identifier),
	    ev = itc._event;
	return ids.map(function(id) { return new this(id, ev); }, this);
};


ITC.prototype.event = function itcEvent() {
	return this.constructor.event(this);
};

ITC.prototype.fork = function itcFork() {
	return this.constructor.fork(this);
};


if (typeof module == 'object') {
	ITC.Identifier = require('./identifier');
	ITC.Event = require('./event');
	module.exports = ITC;
} else {
	throw new Error("Browser version not implemented.");
};
