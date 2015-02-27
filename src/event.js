//
// Interval Clock Tree - Event
// Based on P.S. Almeida et al., DI/CCTC, Universidade do Minho, Braga, Portugal, 2008
// Copyright (c) 2015 Bastiaan Marinus van de Weerd. All Rights Reserved.
//


function ITCEvent(tree) {
	this.tree = (tree != null ? tree : 0);
};


function decodeITCEventNumber(bits, offset, width) {
	if (bits[offset]) {
		var result = decodeITCEventNumber.call(this, bits, offset + 1, width + 1);
		return [result[0] + Math.pow(2, width), result[1]];
	} else {
		var value = 0;
		for (var i = 0; i < width; ++i) {
			var b = bits[offset + 1 + i];
			value = value + (b ? Math.pow(2, width - 1 - i) : 0);
		};
		return [value, offset + 1 + width];
	};
};

function decodeITCEventTree(bits, offset) {
	if (offset + 4 > bits.length) {
		return [0, offset + 4];
	} else if (bits[offset]) {
		return decodeITCEventNumber.call(this, bits, offset + 1, 2);
	} else if (bits[offset + 1]) {
		if (bits[offset + 2]) {
			if (bits[offset + 3]) {
				var baseResult = decodeITCEventTree.call(this, bits, offset + 4),
				    leftResult = decodeITCEventTree.call(this, bits, baseResult[1]),
				    rightResult = decodeITCEventTree.call(this, bits, leftResult[1]);

				return [[baseResult[0], leftResult[0], rightResult[0]], rightResult[1]];
			} else if (bits[offset + 4]) {
				var baseResult = decodeITCEventTree.call(this, bits, offset + 5);
				    leftResult = decodeITCEventTree.call(this, bits, baseResult[1]);

				return [[baseResult[0], leftResult[0], 0], leftResult[1]];
			} else {
				var baseResult = decodeITCEventTree.call(this, bits, offset + 5);
				    rightResult = decodeITCEventTree.call(this, bits, baseResult[1]);

				return [[baseResult[0], 0, rightResult[0]], rightResult[1]];
			};
		} else {
			var leftResult = decodeITCEventTree.call(this, bits, offset + 3),
			    rightResult = decodeITCEventTree.call(this, bits, leftResult[1]);

			return [[0, leftResult[0], rightResult[0]], rightResult[1]];
		};
	} else if (bits[offset + 2]) {
		var leftResult = decodeITCEventTree.call(this, bits, offset + 3);

		return [[0, leftResult[0], 0], leftResult[1]];
	} else {
		var rightResult = decodeITCEventTree.call(this, bits, offset + 3);

		return [[0, 0, rightResult[0]], rightResult[1]];
	};
};

function encodeITCEventNumber(number, width) {
	var base = Math.pow(2, width);
	if (number < base) {
		var bits = [false];
		for (var i = 0; i < width; ++i) {
			var bit = Math.pow(2, width - 1 - i);
			bits.push(number & bit ? true : false);
		};
		return bits;
	} else {
		return [true].concat(encodeITCEventNumber.call(this, number - base, width + 1));
	}
};

function encodeITCEventTree(tree) {
	if (typeof tree == 'number') {
		return [true].concat(encodeITCEventNumber.call(this, tree, 2));
	} else if (tree[0] == 0) {
		if (tree[1] == 0) {
			var tree2Bits = encodeITCEventTree.call(this, tree[2]);

			return [false, false, false].concat(tree2Bits);
		} else if (tree[2] == 0) {
			var tree1Bits = encodeITCEventTree.call(this, tree[1]);

			return [false, false, true].concat(tree1Bits);
		} else {
			var tree1Bits = encodeITCEventTree.call(this, tree[1]),
			    tree2Bits = encodeITCEventTree.call(this, tree[2]);

			return [false, true, false].concat(tree1Bits).concat(tree2Bits);
		};
	} else if (tree[1] == 0) {
		var tree0Bits = encodeITCEventTree.call(this, tree[0]),
		    tree2Bits = encodeITCEventTree.call(this, tree[2]);

		return [false, true, true, false, false].concat(tree0Bits).concat(tree2Bits);
	} else if (tree[2] == 0) {
		var tree0Bits = encodeITCEventTree.call(this, tree[0]),
		    tree1Bits = encodeITCEventTree.call(this, tree[1]);

		return [false, true, true, false, true].concat(tree0Bits).concat(tree1Bits);
	} else {
		var tree0Bits = encodeITCEventTree.call(this, tree[0]),
		    tree1Bits = encodeITCEventTree.call(this, tree[1]),
		    tree2Bits = encodeITCEventTree.call(this, tree[2]);

		return [false, true, true, true, true].concat(tree0Bits).concat(tree1Bits).concat(tree2Bits);
	};
};



function liftITCEventTree(tree, delta) {
	if (typeof tree == 'number') { return tree + delta; }
	else { return [tree[0] + delta, tree[1], tree[2]]; };
};

function sinkITCEventTree(tree, delta) {
	if (typeof tree == 'number') { return tree - delta; }
	else { return [tree[0] - delta, tree[1], tree[2]]; };
};

function maxITCEventTree(tree) {
	if (typeof tree == 'number') { return tree; }
	else { return tree[0] + Math.max(
		maxITCEventTree.call(this, tree[1]),
		maxITCEventTree.call(this, tree[2])
	); };
};

function minITCEventTree(tree) {
	if (typeof tree == 'number') { return tree; }
	else { return tree[0] + Math.min(
		minITCEventTree.call(this, tree[1]),
		minITCEventTree.call(this, tree[2])
	); };
};

function normITCEventTree(tree) {
	var tree1 = undefined;

	if (typeof tree == 'number') {
		return tree;
	} else if (typeof (tree1 = tree[1]) == 'number' && tree[1] === tree[2]) {
		return tree[0] + tree1;
	} else {
		var tree1 = normITCEventTree.call(this, tree[1]),
		    tree2 = normITCEventTree.call(this, tree[2]);
		var sinkDelta = Math.min(
			minITCEventTree.call(this, tree1),
			minITCEventTree.call(this, tree2)
		);

		return [
			tree[0] + sinkDelta,
			sinkITCEventTree.call(this, tree1, sinkDelta),
			sinkITCEventTree.call(this, tree2, sinkDelta),
		];
	};
};

function joinITCEventTrees(treeA, treeB) {
	var treeAIsNumber = typeof treeA == 'number',
	    treeBIsNumber = typeof treeB == 'number';

	if (treeAIsNumber & treeBIsNumber) {
		return Math.max(treeA, treeB);
	} else if (treeAIsNumber) {
		return joinITCEventTrees.call(this, [treeA, 0, 0], treeB);
	} else if (treeBIsNumber) {
		return joinITCEventTrees.call(this, treeA, [treeB, 0, 0]);
	} else if (treeA[0] > treeB[0]) {
		return joinITCEventTrees.call(this, treeB, treeA);
	} else {
		var treeA0 = treeA[0],
		    treeB0 = treeB[0],
		    liftDelta = treeB0 - treeA0;

		return normITCEventTree.call(this, [treeA0,
			joinITCEventTrees.call(this, treeA[1], liftITCEventTree.call(this, treeB[1], liftDelta)),
			joinITCEventTrees.call(this, treeA[2], liftITCEventTree.call(this, treeB[2], liftDelta)),
		]);
	};
};

function fillITCEventTree(evTree, idTree) {
	if (typeof evTree == 'number') {
		return evTree;
	} else if (typeof idTree == 'boolean') {
		if (idTree === false) { return evTree; }
		else { return maxITCEventTree.call(this, evTree); };
	} else if (idTree[0] === true) {
		var evTree1 = evTree[1],
		    evTree2 = evTree[2],
		    filledEvTree2 = fillITCEventTree.call(this, evTree2, idTree[1]);

		if (filledEvTree2 === evTree2 && typeof evTree1 === 'number') { return evTree; }
		else { return normITCEventTree.call(this, [evTree[0],
			Math.max(maxITCEventTree.call(this, evTree1), minITCEventTree.call(this, filledEvTree2)),
			evTree2,
		]); };
	} else if (idTree[1] === true) {
		var evTree1 = evTree[1],
		    filledEvTree1 = fillITCEventTree.call(this, evTree1, idTree[0]),
		    evTree2 = evTree[2];

		if (filledEvTree1 === evTree1 && typeof evTree2 === 'number') { return evTree; }
		else { return normITCEventTree.call(this, [evTree[0],
			filledEvTree1,
			Math.max(minITCEventTree.call(this, filledEvTree1), maxITCEventTree.call(this, evTree2)),
		]); };
	} else {
		var evTree1 = evTree[1],
		    filledEvTree1 = fillITCEventTree.call(this, evTree1, idTree[0]),
		    evTree2 = evTree[2],
		    filledEvTree2 = fillITCEventTree.call(this, evTree2, idTree[1]);

		if (filledEvTree1 === evTree1 && filledEvTree2 === evTree2) { return evTree; }
		else { return normITCEventTree.call(this, [evTree[0], filledEvTree1, filledEvTree2]); };
	};
};

function growITCEventTree(evTree, idTree) {
	if (idTree === false) {
		return [evTree, 0];
	} else if (typeof evTree == 'number') {
		if (idTree === true) {
			return [evTree + 1, 0];
		} else {
			var evTreeGrowth = growITCEventTree.call(this, [evTree, 0, 0], idTree);

			return [evTreeGrowth[0], Number.MAX_VALUE];
		};
	} else if (idTree[0] === false) {
		var evTreeGrowth = growITCEventTree.call(this, evTree[2], idTree[1]);

		return [[evTree[0], evTree[1], evTreeGrowth[0]], evTreeGrowth[1] + 1];
	} else if (idTree[1] === false) {
		var evTreeGrowth = growITCEventTree.call(this, evTree[1], idTree[0]);

		return [[evTree[0], evTreeGrowth[0], evTree[2]], evTreeGrowth[1] + 1];
	} else {
		var evTree1 = evTree[1],
		    evTree1Growth = growITCEventTree.call(this, evTree1, idTree[0]),
		    evTree1GrowthCost = evTree1Growth[1],
		    evTree2 = evTree[2],
		    evTree2Growth = growITCEventTree.call(this, evTree2, idTree[1]),
		    evTree2GrowthCost = evTree2Growth[1];

		if (evTree1GrowthCost < evTree2GrowthCost) {
			return [[evTree[0], evTree1Growth[0], evTree2], evTree1GrowthCost + 1];
		} else {
			return [[evTree[0], evTree1, evTree2Growth[0]], evTree2GrowthCost + 1];
		};
	};
};

function eventITCEventTree(evTree, idTree) {
	var filledEvTree = fillITCEventTree.call(this, evTree, idTree);
	if (filledEvTree !== evTree) { return filledEvTree; }
	else { return growITCEventTree.call(this, evTree, idTree)[0]; };
};


function setDecodeFn(util) {
	this.decode = function decodeITCEvent(arg0, arg1, arg2) {
		var buffer = Buffer.isBuffer(arg0) ? arg0 : new Buffer(arg0, arg1 ? arg1 : 'base64'),
		    bits = util.bufferToBits(buffer),
		    result = decodeITCEventTree.call(this, bits, arg2 || arg1 || 0),
		    tree = normITCEventTree.call(this, result[0]);
		return [new this(tree), result[1]];
	};
};

ITCEvent.parse = function parseITCEvent() {
	return this.decode.apply(this, arguments)[0];
};

function setEncodeFn(util) {
	this.encode = function encodeITCEvent(ev, enc) {
		var tree = ev ? ev.tree : 0,
		    bits = encodeITCEventTree.call(this, tree);
		if (enc === Array) { return bits; };

		var buffer = util.bitsToBuffer(bits);
		return [enc != undefined ? buffer.toString(enc) : buffer, bits.length];
	};
};

ITCEvent.toBuffer = function toITCEventBuffer(ev) {
	return this.encode.call(this, ev)[0];
};

ITCEvent.toString = function toITCEventBuffer(ev, env) {
	return this.encode.call(this, ev, env || 'base64')[0];
};

ITCEvent.join = function joinITCEvents(evA, evB) {
	var treeA = evA ? evA.tree : 0,
	    treeB = evB ? evB.tree : 0;
	return new this(joinITCEventTrees.call(this, treeA, treeB));
};

ITCEvent.event = function eventITCEvent(ev, id) {
	return new this(eventITCEventTree.call(this, ev ? ev.tree : 0, id ? id.tree : false));
};


ITCEvent.prototype.event = function itcEventEvent(id) {
	return this.constructor.event(this, id);
};

ITCEvent.prototype.encode = function itcEventEncode(enc) {
	return this.constructor.encode(this, enc);
};

ITCEvent.prototype.toBuffer = function itcEventToBuffer() {
	return this.constructor.toBuffer();
};

ITCEvent.prototype.toString = function itcEventToString(enc) {
	return this.constructor.toString(enc);
};


if (typeof module == 'object') {
	var util = require('./util');

	setDecodeFn.call(ITCEvent, util);
	setEncodeFn.call(ITCEvent, util);
	module.exports = ITCEvent;
} else {
	throw new Error("Browser version not implemented.");
};
