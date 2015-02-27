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

    equalBuffer = (bufB) ->
    	(expect @_obj.toString 'binary').to.equal bufB.toString 'binary'
    chai.Assertion.addChainableMethod 'equalBuffer', equalBuffer
    chai.Assertion.addChainableMethod 'equalsBuffer', equalBuffer

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

    	it "should have `decode`, `encode`, `join`, and `event` class methods", ->
    		(expect @Event).to.have.a.property 'decode'
    			.that.is.a 'function'
    		(expect @Event).to.have.a.property 'parse'
    			.that.is.a 'function'
    		(expect @Event).to.have.a.property 'encode'
    			.that.is.a 'function'
    		(expect @Event).to.have.a.property 'toBuffer'
    			.that.is.a 'function'
    		(expect @Event).to.have.a.property 'toString'
    			.that.is.a 'function'
    		(expect @Event).to.have.a.property 'join'
    			.that.is.a 'function'
    		(expect @Event).to.have.a.property 'event'
    			.that.is.a 'function'

    	describe "its `decode` class method", ->
    		it "should decode <1:1,enc(n,2)> into an EVn instance", ->
    			[ev, offset] = @Event.decode new Buffer [0x90] # NB. 1001 (0000)
    			(expect ev).to.equalEvent 1
    			(expect offset).to.equal 4

    			[ev, offset] = @Event.decode new Buffer [0xd4] # NB. 1101 01(00)
    			(expect ev).to.equalEvent 9
    			(expect offset).to.equal 6

    			[ev, offset] = @Event.decode new Buffer [0xe5] # NB. 1110 0101
    			(expect ev).to.equalEvent 17
    			(expect offset).to.equal 8

    		it "should decode <0:1,3:2,1:1,enc(n),enc(eL),enc(eR)> into an EV[n,eL,eR] instance", ->
    			[ev, offset] = @Event.decode new Buffer [0x78, 0x89] # NB. 0111 1000 1000 1001
    			(expect ev).to.equalEvent [0, 0, 1]
    			(expect offset).to.equal 16

    			[ev, offset] = @Event.decode new Buffer [0x78, 0x98] # NB. 0111 1000 1001 1000
    			(expect ev).to.equalEvent [0, 1, 0]
    			(expect offset).to.equal 16

    		it "should decode <0:1,3:2,0:1,0:1,enc(n),enc(eR)> into an EV[n,0,eR] instance", ->
    			[ev, offset] = @Event.decode new Buffer [0x64, 0x48] # NB. 0110 0100 0100 1(000)
    			(expect ev).to.equalEvent [0, 0, 1]
    			(expect offset).to.equal 13

    		it "should decode <0:1,3:2,0:1,1:1,enc(n),enc(eL)> into an EV[n,eL,0] instance", ->
    			[ev, offset] = @Event.decode new Buffer [0x6c, 0x48] # NB. 0110 1100 0100 1(000)
    			(expect ev).to.equalEvent [0, 1, 0]
    			(expect offset).to.equal 13

    		it "should decode <0:1,2:2,enc(eL),enc(eR)> into an EV[0,eL,eR] instance", ->
    			[ev, offset] = @Event.decode new Buffer [0x51, 0x20] # NB. 0101 0001 001(0 0000)
    			(expect ev).to.equalEvent [0, 0, 1]
    			(expect offset).to.equal 11

    			[ev, offset] = @Event.decode new Buffer [0x53, 0x00] # NB. 0101 0011 000(0 0000)
    			(expect ev).to.equalEvent [0, 1, 0]
    			(expect offset).to.equal 11

    		it "should decode <0:1,1:2,enc(eL)> into an EV[0,eL,0] instance", ->
    			[ev, offset] = @Event.decode new Buffer [0x32, 0x00] # NB. 0011 001(0 0000 0000)
    			(expect ev).to.equalEvent [0, 1, 0]
    			(expect offset).to.equal 7

    		it "should decode <0:1,0:2,enc(eR)> into an EV[0,0,eR] instance", ->
    			[ev, offset] = @Event.decode new Buffer [0x12, 0x00] # NB. 0001 001(0 0000 0000)
    			(expect ev).to.equalEvent [0, 0, 1]
    			(expect offset).to.equal 7

    	describe "its `encode` class method", ->
    		it "should encode an EVn instance into <1:1,env(n,2)>", ->
    			[b, l] = @Event.encode new @Event 1
    			(expect b).to.equalBuffer new Buffer [0x90] # NB. 1001 (0000)
    			(expect l).to.equal 4

    			[b, l] = @Event.encode new @Event 9
    			(expect b).to.equalBuffer new Buffer [0xd4] # NB. 1101 01(00)
    			(expect l).to.equal 6

    			[b, l] = @Event.encode new @Event 17
    			(expect b).to.equalBuffer new Buffer [0xe5] # NB. 1110 0101
    			(expect l).to.equal 8

    		it "should encode an EV[0, 0, eR] instance into <0:1,0:2,enc(eR)>", ->
    			[b, l] = @Event.encode new @Event [0, 0, 1]
    			(expect b).to.equalBuffer new Buffer [0x12] # NB. 0001 001(0)
    			(expect l).to.equal 7

    		it "should encode an EV[0, eL, 0] instance into <0:1,1:2,enc(eL)>", ->
    			[b, l] = @Event.encode new @Event [0, 1, 0]
    			(expect b).to.equalBuffer new Buffer [0x32] # NB. 0011 001(0)
    			(expect l).to.equal 7

    		it "should encode an EV[0, eL, eR] instance into <0:1,2:2,enc(eL),enc(eR)>", ->
    			[b, l] = @Event.encode new @Event [0, 1, [0, 0, 1]]
    			(expect b).to.equalBuffer new Buffer [0x52, 0x24] # NB. 0101 0010 0010 01(00)
    			(expect l).to.equal 14

    			[b, l] = @Event.encode new @Event [0, [0, 1, 0], 1]
    			(expect b).to.equalBuffer new Buffer [0x46, 0x64] # NB. 0100 0110 0110 01(00)
    			(expect l).to.equal 14

    		it "should encode an EV[n, 0, eR] instance into <0:1,3:2,0:1,0:1,enc(n),enc(eR)>", ->
    			[b, l] = @Event.encode new @Event [1, 0, 1]
    			(expect b).to.equalBuffer new Buffer [0x64, 0xc8] # NB. 0110 0100 1100 1(000)
    			(expect l).to.equal 13

    		it "should encode an EV[n, eL, 0] instance into <0:1,3:2,0:1,1:1,enc(n),enc(eL)>", ->
    			[b, l] = @Event.encode new @Event [1, 1, 0]
    			(expect b).to.equalBuffer new Buffer [0x6c, 0xc8] # NB. 0110 1100 1100 1(000)
    			(expect l).to.equal 13

    		it "should encode an EV[n, eL, eR] instance into <0:1,3:2,1:1,enc(n),enc(eL),enc(eR)>", ->
    			[b, l] = @Event.encode new @Event [1, 1, [0, 0, 1]]
    			(expect b).to.equalBuffer new Buffer [0x7c, 0xc8, 0x90] # NB. 0,11,1, 1,100 1,100 1,000 1001 (0000)
    			(expect l).to.equal 20

    			[b, l] = @Event.encode new @Event [1, [0, 1, 0], 1]
    			(expect b).to.equalBuffer new Buffer [0x7c, 0x99, 0x90] # NB. 0,11,1, 1,100 1,001 1001, 1001 (0000)
    			(expect l).to.equal 20

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
    		it "should have an `encode` prototype method that calls the `encode` class method", ->
    			(expect @Event.prototype).to.have.a.property 'encode'
    				.that.is.a 'function'

    			[encodeFn, encodeSpy] = [@Event.encode, (@Event.encode = sinon.spy -> [(new Buffer [0x80]), 4])]
    			ev = new @Event
    			[b, l] = @Event.prototype.encode.call ev
    			(expect encodeSpy.calledOnce).to.equal true
    			(expect encodeSpy.args[0][0]).to.equal ev
    			(expect b).to.equalBuffer new Buffer [0x80]
    			(expect l).to.equal 4

    			@Event.encode = encodeFn

    			(expect @Event.prototype).to.have.an.ownProperty 'toBuffer'
    			(expect @Event.prototype).to.have.an.ownProperty 'toString'

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
