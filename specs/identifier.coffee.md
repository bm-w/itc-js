# Interval Tree Clock - Identifier

…

    rewire = require 'rewire'
    expect = (chai = require 'chai').expect
    sinon = require 'sinon'

    equalIdentifier = (idB) ->
    	[treeA, treeB] = [@_obj.tree ? @_obj, idB.tree ? idB]
    	(expect treeA).to.deep.equal treeB
    chai.Assertion.addChainableMethod 'equalIdentifier', equalIdentifier
    chai.Assertion.addChainableMethod 'equalsIdentifier', equalIdentifier

…

    describe "the `ITCIdentifier` class", ->
    	before ->
    		@Identifier = rewire '../src/identifier'

    	it "should initialize with a boolean tree", ->
    		initializing = -> new @Identifier
    		(expect initializing.bind @).to.not.throw Error
    		id = initializing.call @
    		(expect id).to.be.an.instanceOf @Identifier
    		(expect id).to.have.a.property 'tree', false
    		(expect id).to.equalIdentifier false
