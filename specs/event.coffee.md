# Interval Tree Clock - Identifier

…

    rewire = require 'rewire'
    expect = (chai = require 'chai').expect
    sinon = require 'sinon'

    equalEvent = (evB) ->
    	[treeA, treeB] = [@_obj.tree ? @_obj, evB.tree ? evB]
    	(expect treeA).to.deep.equal treeB
    chai.Assertion.addChainableMethod 'equalEvent', equalEvent
    chai.Assertion.addChainableMethod 'equalsEvent', equalEvent

…

    describe "the `ITCEvent` class", ->
    	before ->
    		@Event = rewire '../src/event'

    	it "should initialize with a number tree", ->
    		initializing = -> new @Event
    		(expect initializing.bind @).to.not.throw Error
    		ev = initializing.call @
    		(expect ev).to.be.an.instanceOf @Event
    		(expect ev).to.have.a.property 'tree', 0
    		(expect ev).to.equalEvent 0
