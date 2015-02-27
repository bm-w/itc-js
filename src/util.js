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

// TODO: Browser
function node_bitsToBuffer(bits) {
	var bytes = [];
	for (var i = 0, n = bits.length; i < n; i += 8) {
		bytes.push(
			(bits[i + 0] ? 0x80 : 0x0) |
			(bits[i + 1] ? 0x40 : 0x0) |
			(bits[i + 2] ? 0x20 : 0x0) |
			(bits[i + 3] ? 0x10 : 0x0) |
			(bits[i + 4] ? 0x08 : 0x0) |
			(bits[i + 5] ? 0x04 : 0x0) |
			(bits[i + 6] ? 0x02 : 0x0) |
			(bits[i + 7] ? 0x01 : 0x0)
		);
	};
	return new Buffer(bytes.length > 0 ? bytes : "");
};


if (typeof module == 'object') {
	module.exports = {
		bufferToBits: node_bufferToBits,
		bitsToBuffer: node_bitsToBuffer,
	};
} else {
	throw new Error("Browser version not implemented.");
};
