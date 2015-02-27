# Interval Tree Clock - Identifier

…

    rewire = require 'rewire'
    expect = (chai = require 'chai').expect
    sinon = require 'sinon'

    equalIdentifier = (idB) ->
    	[treeA, treeB] = [@_obj.tree, idB.tree ? idB]
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

    	it "should have `decode`, `join`, and `fork` class methods", ->
    		(expect @Identifier).to.have.a.property 'decode'
    			.that.is.a 'function'
    		(expect @Identifier).to.have.a.property 'parse'
    			.that.is.a 'function'
    		(expect @Identifier).to.have.a.property 'join'
    			.that.is.a 'function'
    		(expect @Identifier).to.have.a.property 'fork'
    			.that.is.a 'function'

    	describe "its `decode` class method", ->
    		it "should decode <0:2,0-1:1> into ID0 and ID1 instances", ->
    			[id, offset] = @Identifier.decode new Buffer [0x00] # NB. 000(00000)
    			(expect id).to.equalIdentifier false
    			(expect offset).to.equal 3

    			[id, offset] = @Identifier.decode new Buffer [0x20] # NB. 001(00000)
    			(expect id).to.equalIdentifier true
    			(expect offset).to.equal 3

    		it "should decode <1-2:2,0:2,1:1> into ID[0,1] and ID[1,0] instances", ->
    			[id, offset] = @Identifier.decode new Buffer [0x48] # NB. 01001(000)
    			(expect id).to.equalIdentifier [false, true]
    			(expect offset).to.equal 5

    			[id, offset] = @Identifier.decode new Buffer [0x88] # NB. 11001(000)
    			(expect id).to.equalIdentifier [true, false]
    			(expect offset).to.equal 5

    		it "should decode <3:2,0:2,0-1:1,0:2,0-1:1> into normalized ID0 and ID1 instances", ->
    			[id, offset] = @Identifier.decode new Buffer [0xc0] # NB. 11000000
    			(expect id).to.equalIdentifier false
    			(expect offset).to.equal 8

    			[id, offset] = @Identifier.decode new Buffer [0xc9] # NB. 11001001
    			(expect id).to.equalIdentifier true
    			(expect offset).to.equal 8

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

    	describe "its `fork` class method", ->
    		it "should fork an ID0 instance into two ID0 instances", ->
    			[idA, idB] = (new @Identifier false).fork()
    			(expect idA, "the left `false` fork").to.equalIdentifier false
    			(expect idB, "the right `false` fork").to.equalIdentifier false

    		it "should fork an ID1 instance into ID[1,0] and ID[0,1] instances", ->
    			[idA, idB] = (new @Identifier true).fork()
    			(expect idA, "the left `true` fork").to.equalIdentifier [true, false]
    			(expect idB, "the right `true` fork").to.equalIdentifier [false, true]

    		it "should fork an ID[0,1] instance into ID[0,[1,0]] and ID[0,[0,1]] instances", ->
    			[idA, idB] = (new @Identifier [false, true]).fork()
    			(expect idA, "the left `[false, true]` fork").to.equalIdentifier [false, [true, false]]
    			(expect idB, "the right `[false, true]` fork").to.equalIdentifier [false, [false, true]]

    			[idA, idB] = (new @Identifier [true, false]).fork()
    			(expect idA, "the left `[true, false]` fork").to.equalIdentifier [[true, false], false]
    			(expect idB, "the right `[true, false]` fork").to.equalIdentifier [[false, true], false]

    		it "should fork an arbitrary instance into two instances", ->
    			[idA, idB] = (new @Identifier [[true, false], [false, true]]).fork()
    			(expect idA, "the left `[[false, true], [false, true]]` fork").to.equalIdentifier [[true, false], false]
    			(expect idB, "the right `[[false, true], [false, true]]` fork").to.equalIdentifier [false, [false, true]]

    	describe "its instances", ->
    		it "should have a `fork` prototype method that calls the `fork` class method", ->
    			(expect @Identifier.prototype).to.have.a.property 'fork'
    				.that.is.a 'function'

    			[forkFn, forkSpy] = [@Identifier.fork, (@Identifier.fork = do sinon.spy)]
    			id = new @Identifier false
    			@Identifier.prototype.fork.call id
    			(expect forkSpy.calledOnce).to.equal true
    			(expect forkSpy.args[0][0]).to.equal id
    			@Identifier.fork = forkFn
