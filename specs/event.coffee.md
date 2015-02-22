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

    	it "should have `join` and `event` class methods", ->
    		(expect @Event).to.have.a.property 'join'
    			.that.is.a 'function'
    		(expect @Event).to.have.a.property 'event'
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

    	describe "its `event` class method", ->
    		it "should not fill or grow an ID0-EVe event", ->
    			[ev, id] = [(new @Event 1), tree: false]
    			(expect (@Event.event ev, id), "the ID0-EV1 event").to.equalEvent 1
    			[ev, id] = [(new @Event [2, 1, 0]), tree: false]
    			(expect (@Event.event ev, id), "the ID0-EV[2,1,0] event").to.equalEvent [2, 1, 0]
    			[ev, id] = [(new @Event [2, 0, 1]), tree: false]
    			(expect (@Event.event ev, id), "the ID0-EV[2,0,1] event").to.equalEvent [2, 0, 1]
    		
    		it "should fill an ID1-EV[n,m,0] event into an EV[n+m] instance", ->
    			[ev, id] = [(new @Event [2, 1, 0]), tree: true]
    			(expect (@Event.event ev, id), "the ID1-EV[2,1,0] event").to.equalEvent 3
    			[ev, id] = [(new @Event [2, 0, 1]), tree: true]
    			(expect (@Event.event ev, id), "the ID1-EV[2,0,1] event").to.equalEvent 3

    		it "should fill an ID[1,0]-EV[n,[m,l,0],r] event into a norm(EV[n,m+l,r]) instance", ->
    			[ev, id] = [(new @Event [1, [0, 1, 0], 1]), tree: [true, false]]
    			(expect (@Event.event ev, id), "the ID[1,0]-EV[1,[0,1,0],1] event").to.equalEvent 2
    			[ev, id] = [(new @Event [1, 1, [0, 1, 0]]), tree: [false, true]]
    			(expect (@Event.event ev, id), "the ID[0,1]-EV[1,1,[0,1,0]] event").to.equalEvent 2
    			[ev, id] = [(new @Event [3, [2, 0, 1], 0]), tree: [true, false]]
    			(expect (@Event.event ev, id), "the ID[1,0]-EV[3,[2,0,1],0] event").to.equalEvent [3, 3, 0]
    			[ev, id] = [(new @Event [3, 0, [2, 0, 1]]), tree: [false, true]]
    			(expect (@Event.event ev, id), "the ID[0,1]-EV[3,0,[2,0,1]] event").to.equalEvent [3, 0, 3]

    		it "should fill an arbitrary event into an arbitrary instance", ->
    			[ev, id] = [(new @Event [1, [0, [2, 1, 0], 0], 0]), tree: [[true, false], false]]
    			(expect (@Event.event ev, id), "the ID[[1,0],0]-EV[1,[0,[2,1,0],0],0] event").to.equalEvent [1, [0, 3, 0], 0]
    			[ev, id] = [(new @Event [1, 0, [0, 0, [2, 1, 0]]]), tree: [false, [false, true]]]
    			(expect (@Event.event ev, id), "the ID[[1,0],0]-EV[1,[0,[2,1,0],0],0] event").to.equalEvent [1, 0, [0, 0, 3]]

    		it "should grow an ID1-EVn event into an EVn+1 instance", ->
    			[ev, id] = [(new @Event 2), tree: true]
    			(expect (@Event.event ev, id), "the ID1-EV1 event").to.equalEvent 3

    		it "should grow an IDi-EVn event into an IDi-EV[n,0,0] event instance", ->
    			[ev, id] = [(new @Event 2), tree: [true, false]]
    			(expect (@Event.event ev, id), "the ID1-EV1 event").to.equalEvent [2, 1, 0]
    			[ev, id] = [(new @Event 2), tree: [false, true]]
    			(expect (@Event.event ev, id), "the ID1-EV1 event").to.equalEvent [2, 0, 1]

    		it "should grow an ID[1,0]-EV[n,m,0] event into an EV[n,m+1,0] instance", ->
    			[ev, id] = [(new @Event [2, 1, 0]), tree: [true, false]]
    			(expect (@Event.event ev, id), "the ID1-EV1 event").to.equalEvent [2, 2, 0]
    			[ev, id] = [(new @Event [2, 0, 1]), tree: [false, true]]
    			(expect (@Event.event ev, id), "the ID1-EV1 event").to.equalEvent [2, 0, 2]

    		it "should grow an arbitrary event into an arbitrary instance", ->
    			[ev, id] = [(new @Event [1, 1, [0, [2, 0, 1], 0]]), tree: [[true, false], [[false, true], false]]]
    			(expect (@Event.event ev, id), "the ID[[1,0],[[0,1],0]]-EV[1,1,[0,[2,0,1],0]] event").to.equalEvent [1, 1, [0, [2, 0, 2], 0]]
    			[ev, id] = [(new @Event [1, [0, 0, [2, 1, 0]], 1]), tree: [[false, [true, false]], [false, true]]]
    			(expect (@Event.event ev, id), "the ID[[1,0],[[0,1],0]]-EV[1,1,[0,[2,0,1],0]] event").to.equalEvent [1, [0, 0, [2, 2, 0]], 1]

    	describe "its instances", ->
    		it "should have an `event` prototype method that calls the `event` class method", ->
    			(expect @Event.prototype).to.have.a.property 'event'
    				.that.is.a 'function'

    			[eventFn, eventSpy] = [@Event.event, (@Event.event = sinon.spy => new @Event 1)]
    			ev = new @Event
    			r = @Event.prototype.event.call ev
    			(expect eventSpy.calledOnce).to.equal true
    			(expect eventSpy.args[0][0]).to.equal ev
    			(expect r).to.equalEvent 1

    			@Event.event = eventFn
