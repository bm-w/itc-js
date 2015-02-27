//
// Interval Clock Tree - Utilities
// Based on P.S. Almeida et al., DI/CCTC, Universidade do Minho, Braga, Portugal, 2008
// Copyright (c) 2015 Bastiaan Marinus van de Weerd. All Rights Reserved.
//


// TODO: Browser
function node_bufferToBits(buffer) {
	var bits = [];
	for (var i = 0, n = buffer.length; i < n; ++i) {
		var b = buffer[i];
		bits = bits.concat([
			0x80 & b ? true : false,
			0x40 & b ? true : false,
			0x20 & b ? true : false,
			0x10 & b ? true : false,
			0x08 & b ? true : false,
			0x04 & b ? true : false,
			0x02 & b ? true : false,
			0x01 & b ? true : false,
		]);
	};
	return bits;
};


if (typeof module == 'object') {
	module.exports = {
		bufferToBits: node_bufferToBits,
	};
} else {
	throw new Error("Browser version not implemented.");
};
