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

    	it "should have a `join` class method", ->
    		(expect @Identifier).to.have.a.property 'join'
    			.that.is.a 'function'

    	describe "its `join` class method", ->
    		it "should join ID0 and ID1 instances into an ID1 instance", ->
    			id = @Identifier.join (new @Identifier false), (new @Identifier true)
    			(expect id, "the ID0-ID1 join").to.equalIdentifier true
    			id = @Identifier.join (new @Identifier true), (new @Identifier false)
    			(expect id, "the ID1-ID0 join").to.equalIdentifier true

    		it "should join ID[1,0] and ID[0,1] instances into an ID1 instance", ->
    			id = @Identifier.join (new @Identifier [true, false]), (new @Identifier [false, true])
    			(expect id, "the `[true, false]`-`[false, true]` join").to.equalIdentifier true
    			id = @Identifier.join (new @Identifier [false, true]), (new @Identifier [true, false])
    			(expect id, "the `[true, false]`-`[false, true]` join").to.equalIdentifier true
