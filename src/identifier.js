//
// Interval Clock Tree - Identifier
// Based on P.S. Almeida et al., DI/CCTC, Universidade do Minho, Braga, Portugal, 2008
// Copyright (c) 2015 Bastiaan Marinus van de Weerd. All Rights Reserved.
//


function ITCIdentifier(tree) {
	this.tree = (tree != null ? tree : false);
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


if (typeof module == 'object') {
	module.exports = ITCIdentifier;
} else {
	throw new Error("Browser version not implemented.");
};
