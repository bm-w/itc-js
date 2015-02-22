//
// Interval Clock Tree - Event
// Based on P.S. Almeida et al., DI/CCTC, Universidade do Minho, Braga, Portugal, 2008
// Copyright (c) 2015 Bastiaan Marinus van de Weerd. All Rights Reserved.
//


function ITCEvent(tree) {
	this.tree = (tree != null ? tree : 0);
};


if (typeof module == 'object') {
	module.exports = ITCEvent;
} else {
	throw new Error("Browser version not implemented.");
};
