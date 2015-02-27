//
// Interval Clock Tree - Identifier
// Based on P.S. Almeida et al., DI/CCTC, Universidade do Minho, Braga, Portugal, 2008
// Copyright (c) 2015 Bastiaan Marinus van de Weerd. All Rights Reserved.
//


function ITCIdentifier(tree) {
	this.tree = (tree != null ? tree : false);
};


function decodeITCIdentifierTree(bits, offset) {
	if (offset + 3 > bits.length) {
		return [false, offset + 3];
	} else if (bits[offset]) {
		var leftResult = decodeITCIdentifierTree.call(this, bits, offset + 2),
		    leftOffset = leftResult[1];

		if (bits[offset + 1]) {
			var rightResult = decodeITCIdentifierTree.call(this, bits, leftOffset),
			    rightOffset = rightResult[1];

			return [[leftResult[0], rightResult[0]], rightOffset]; 
		} else {
			return [[leftResult[0], false], leftOffset];
		};
	} else if (bits[offset + 1]) {
		var rightResult = decodeITCIdentifierTree.call(this, bits, offset + 2),
		    rightOffset = rightResult[1];

		return [[false, rightResult[0]], rightOffset];
	} else {
		return [bits[offset + 2] ? true : false, offset + 3];
	};
};

function encodeITCIdentifierTreeBits(tree) {
	if (typeof tree == 'boolean') {
		return [false, false, tree];
	} else if (tree[0] == false) {
		return [false, true].concat(encodeITCIdentifierTreeBits.call(this, tree[1]));
	} else if (tree[1] == false) {
		return [true, false].concat(encodeITCIdentifierTreeBits.call(this, tree[0]));
	} else {
		var tree0Bits = encodeITCIdentifierTreeBits.call(this, tree[0]),
		    tree1Bits = encodeITCIdentifierTreeBits.call(this, tree[1]);

		return [true, true].concat(tree0Bits).concat(tree1Bits);
	};
};

function normITCIdentifierTree(tree, recursively) {
	if (!tree.length) {
		return tree;
	} else if (tree[0] === false && tree[1] === false) {
		return false;
	} else if (tree[0] === true && tree[1] === true) {
		return true;
	} else if (recursively === false
	|| (tree[0] === true && tree[1] === false)
	|| (tree[0] === false && tree[1] === true)) {
		return tree;
	} else { return normITCIdentifierTree.call(this, [
		normITCIdentifierTree.call(this, tree[0]),
		normITCIdentifierTree.call(this, tree[1]),
	], false); };
};

function joinITCIdentifierTrees(treeA, treeB) {
	if (!treeA) {
		return /* TODO: Copy? */treeB;
	} else if (!treeB) {
		return /* TODO: Copy? */treeA;
	} else {
		var lA, rA, lB, rB;
		if (treeA.length) { lA = treeA[0], rA = treeA[1]; }
		else { lA = rA = treeA; };
		if (treeB.length) { lB = treeB[0], rB = treeB[1]; }
		else { lB = rB = treeB; };
		return normITCIdentifierTree.call(this, [
			joinITCIdentifierTrees.call(this, lA, lB),
			joinITCIdentifierTrees.call(this, rA, rB)
		]);
	};
};

function forkITCIdentifierTree(tree) {
	if (tree === false) {
		return [false, false];
	} else if (tree === true) {
		return [[true, false], [false, true]];
	} else if (tree[0] === false) {
		var trees = forkITCIdentifierTree.call(this, tree[1]);
		return [[false, trees[0]], [false, trees[1]]];
	} else if (tree[1] === false) {
		var trees = forkITCIdentifierTree.call(this, tree[0]);
		return [[trees[0], false], [trees[1], false]];
	} else {
		return [[tree[0], false], [false, tree[1]]];
	};
};


function setDecodeFn(util) {
	this.decode = function decodeITCIdentifier(arg0, arg1, arg2) {
		var buffer = Buffer.isBuffer(arg0) ? arg0 : new Buffer(arg0, arg1 ? arg1 : 'base64'),
		    bits = util.bufferToBits(buffer),
		    result = decodeITCIdentifierTree.call(this, bits, arg2 || arg1 || 0),
		    tree = normITCIdentifierTree.call(this, result[0]);
		return [new this(tree), result[1]];
	};
};

ITCIdentifier.parse = function parseITCIdentifier() {
	return this.decode.apply(this, arguments)[0];
};

function setEncodeFn(util) {
	this.encode = function toITCIdentifierBits(id, enc) {
		var tree = id ? id.tree : false,
		    bits = encodeITCIdentifierTreeBits.call(this, tree),
		    buffer = util.bitsToBuffer(bits);
		return [enc != undefined ? buffer.toString(enc) : buffer, bits.length];
	};
};

ITCIdentifier.toBuffer = function toITCIdentifierBuffer(id) {
	return this.encode.call(this, id)[0];
};

ITCIdentifier.toString = function toITCIdentifierBuffer(enc) {
	return this.encode.call(this, id, enc || 'base64')[0];
};


ITCIdentifier.join = function joinITCIdentifiers(idA, idB) {
	var treeA = idA ? idA.tree : false,
	    treeB = idB ? idB.tree : false;
	return new this(joinITCIdentifierTrees.call(this, treeA, treeB));
};

ITCIdentifier.fork = function forkITCIdentifier(id) {
	var trees = forkITCIdentifierTree.call(this, id ? id.tree : 0);
	return trees.map(function(t) { return new this(t); }, this);
};

ITCIdentifier.prototype.fork = function itcIdentifierFork() {
	return this.constructor.fork(this);
};

ITCIdentifier.prototype.encode = function itcIdentifierEncode(enc) {
	return this.constructor.encode(this, enc);
};

ITCIdentifier.prototype.toBuffer = function itcIdentifierToBuffer() {
	return this.constructor.toBuffer(this);
};

ITCIdentifier.prototype.toString = function itcIdentifierToString(enc) {
	return this.constructor.toString(enc);
};


if (typeof module == 'object') {
	var util = require('./util');

	setDecodeFn.call(ITCIdentifier, util);
	setEncodeFn.call(ITCIdentifier, util);
	module.exports = ITCIdentifier;
} else {
	throw new Error("Browser version not implemented.");
};
