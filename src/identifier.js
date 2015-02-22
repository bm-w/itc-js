//
// Interval Clock Tree - Identifier
// Based on P.S. Almeida et al., DI/CCTC, Universidade do Minho, Braga, Portugal, 2008
// Copyright (c) 2015 Bastiaan Marinus van de Weerd. All Rights Reserved.
//


function ITCIdentifier(tree) {
	this.tree = (tree != null ? tree : false);
};


if (typeof module == 'object') {
	module.exports = ITCIdentifier;
} else {
	throw new Error("Browser version not implemented.");
};
