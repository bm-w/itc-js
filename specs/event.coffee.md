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

    	it "should have a `join` class method", ->
    		(expect @Event).to.have.a.property 'join'
    			.that.is.a 'function'

    	describe "its `join` class method", ->
    		it "should join EV0 and EV1 instances into an EV1 instance", ->
    			ev = @Event.join (new @Event 0), (new @Event 1)
    			(expect ev, "the EV0-EV1 join").to.equalEvent 1

    		it "should join EV0 and EV[1,0,1] instances into an EV[1,0,1] instance", ->
    			ev = @Event.join (new @Event 0), (new @Event [1, 0, 1])
    			(expect ev, "the EV0-EV[1,0,1] join").to.equalEvent [1, 0, 1]

    			ev = @Event.join (new @Event [1, 0, 1]), (new @Event 0)
    			(expect ev, "the EV[1,0,1]-EV0 join").to.equalEvent [1, 0, 1]

    		it "should join EV[2,2,0] and EV[3,0,1] instances into an EV4 instance", ->
    			ev = @Event.join (new @Event [2, 2, 0]), (new @Event [3, 0, 1])
    			(expect ev, "the EV[2,2,0]-EV[3,0,1] join").to.equalEvent 4

    		it "should join arbitrary instances into an instance", ->
    			ev = @Event.join (new @Event [2, [2, 1, 0], 0]), (new @Event [2, 0, 3])
    			(expect ev, "the EV[2,[2,1,0],0]-EV[2,0,3] join").to.equalEvent [4, [0, 1, 0,], 1]
