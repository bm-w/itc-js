//
// Interval Clock Tree
// Based on P.S. Almeida et al., DI/CCTC, Universidade do Minho, Braga, Portugal, 2008
// Copyright (c) 2015 Bastiaan Marinus van de Weerd. All Rights Reserved.
//


function ITC(identifier, event) {
	this._identifier = identifier ? identifier : new this.constructor.Identifier();
	this._event = event ? event : new this.constructor.Event();
};


ITC.decode = function decodeITC(arg0, arg1, arg2) {
	var IdCtor = this.Identifier,
	    EvCtor = this.Event;

	if (arguments.length == 2) {
		if (typeof arg1 == 'number') {
			arg2 = arg1, arg1 = undefined;
		} else {
			arg2 = 0;
		};
	} else if (arguments.length == 1) {
		arg1 = undefined, arg2 = 0;
	};

	var idResult = IdCtor.decode.apply(IdCtor, [arg0, arg1, arg2]),
	    evResult = EvCtor.decode.apply(EvCtor, [arg0, arg1, idResult[1]]);

	return [new this(idResult[0], evResult[0]), evResult[1]];
};

ITC.parse = function parseITC() {
	return this.decode.apply(this, arguments)[0];
};

function setEncodeFn(util) {
	this.encode = function encodeITC(itc, enc) {
		var idBits = itc._identifier.encode(Array),
		    evBits = itc._event.encode(Array),
		    bits = idBits.concat(evBits);
		if (enc === Array) { return bits; };

		var buffer = util.bitsToBuffer(bits);
		return [enc != undefined ? buffer.toString(enc) : buffer, bits.length];
	};
};

ITC.toBuffer = function toITCBuffer(itc) {
	return this.enccode.call(this, itc)[0];
};

ITC.toString = function toITCBuffer(itc, enc) {
	return this.enccode.call(this, itc, enc || 'base64')[0];
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

ITC.prototype.encode = function itcEncode(enc) {
	return this.constructor.encode(this, enc);
};

ITC.prototype.toBuffer = function itcToBuffer() {
	return this.constructor.toBuffer();
};

ITC.prototype.toString = function itcToString(enc) {
	return this.constructor.toString(this, enc);
};


if (typeof module == 'object') {
	ITC.Identifier = require('./identifier');
	ITC.Event = require('./event');
	setEncodeFn.call(ITC, require('./util'));
	module.exports = ITC;
} else {
	throw new Error("Browser version not implemented.");
};
