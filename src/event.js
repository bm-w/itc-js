//
// Interval Clock Tree - Event
// Based on P.S. Almeida et al., DI/CCTC, Universidade do Minho, Braga, Portugal, 2008
// Copyright (c) 2015 Bastiaan Marinus van de Weerd. All Rights Reserved.
//


function ITCEvent(tree) {
	this.tree = (tree != null ? tree : 0);
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


ITCEvent.join = function joinITCEvents(evA, evB) {
	var treeA = evA ? evA.tree : 0,
	    treeB = evB ? evB.tree : 0;
	return new this(joinITCEventTrees.call(this, treeA, treeB));
};


if (typeof module == 'object') {
	module.exports = ITCEvent;
} else {
	throw new Error("Browser version not implemented.");
};
