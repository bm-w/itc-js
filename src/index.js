//
// Interval Clock Tree
// Based on P.S. Almeida et al., DI/CCTC, Universidade do Minho, Braga, Portugal, 2008
// Copyright (c) 2015 Bastiaan Marinus van de Weerd. All Rights Reserved.
//


function ITC(identifier, event) {
	this._identifier = identifier ? identifier : new this.constructor.Identifier();
	this._event = event ? event : new this.constructor.Event();
};

if (typeof module == 'object') {
	ITC.Identifier = require('./identifier');
	ITC.Event = require('./event');
	module.exports = ITC;
} else {
	throw new Error("Browser version not implemented.");
};
