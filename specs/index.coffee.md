# Interval Tree Clock

…

    rewire = require 'rewire'
    expect = (chai = require 'chai').expect
    sinon = require 'sinon'

    equalITC = (evB) ->
    	[idTreeA, idTreeB] = [@_obj._identifier.tree ? @_obj._identifier, evB._identifier.tree ? evB._identifier]
    	(expect idTreeA).to.deep.equal idTreeB
    	[evTreeA, evTreeB] = [@_obj._event.tree ? @_obj._event, evB._event.tree ? evB._event]
    	(expect evTreeA).to.deep.equal evTreeB
    chai.Assertion.addChainableMethod 'equalITC', equalITC
    chai.Assertion.addChainableMethod 'equalsITC', equalITC

…

    describe "the `ITC` class", ->
    	before ->
    		@ITC = rewire '../src/'

    	it "should initialize", ->
    		initializing = -> new @ITC
    		(expect initializing.bind @).to.not.throw Error
    		itc = initializing.call @
    		(expect itc).to.be.an.instanceOf @ITC
    		(expect itc).to.have.a.property '_identifier'
    			.that.is.an.instanceOf @ITC.Identifier
    		(expect itc).to.have.a.property '_event'
    			.that.is.an.instanceOf @ITC.Event
    		(expect itc).to.equalITC _identifier: false, _event: 0

    	it "should have `Identifier` and `Event` class variables", ->
    		(expect @ITC).to.have.a.property 'Identifier'
    			.that.is.a 'function'
    		(expect @ITC).to.have.a.property 'Event'
    			.that.is.a 'function'

    	it "should have `join`, `event`, and `fork` class methods", ->
    		(expect @ITC).to.have.a.property 'join'
    			.that.is.a 'function'
    		(expect @ITC).to.have.a.property 'event'
    			.that.is.a 'function'
    		(expect @ITC).to.have.a.property 'fork'
    			.that.is.a 'function'

    	describe "its `join` class method", ->
    		it "should call the `join` class methods of `Identifier` and `Event`", ->
    			[idJoinFn, idJoinSpy] = [@ITC.Identifier.join, @ITC.Identifier.join = sinon.spy => new @ITC.Identifier]
    			[evJoinFn, evJoinSpy] = [@ITC.Event.join, @ITC.Event.join = sinon.spy => new @ITC.Event]

    			[idA, idB] = [(new @ITC.Identifier), (new @ITC.Identifier)]
    			[evA, evB] = [(new @ITC.Event), (new @ITC.Event)]
    			@ITC.join (new @ITC idA, evA), (new @ITC idB, evB)
    			(expect idJoinSpy.calledOnce).to.equal true
    			(expect idJoinSpy.args[0][0]).to.equal idA
    			(expect idJoinSpy.args[0][1]).to.equal idB
    			(expect evJoinSpy.calledOnce).to.equal true
    			(expect evJoinSpy.args[0][0]).to.equal evA
    			(expect evJoinSpy.args[0][1]).to.equal evB

    			@ITC.Identifier.join = idJoinFn
    			@ITC.Event.join = evJoinFn

    	describe "its `event` class method", ->
    		it "should call the `event` class method of `Event`", ->
    			[evEventFn, evEventSpy] = [@ITC.Event.event, @ITC.Event.event = sinon.spy => new @ITC.Event]

    			ev = new @ITC.Event
    			@ITC.event new @ITC undefined, ev
    			(expect evEventSpy.calledOnce).to.equal true
    			(expect evEventSpy.args[0][0]).to.equal ev

    			@ITC.Event.event = evEventFn

    	describe "its `fork` class method", ->
    		it "should call the `fork` class method of `Identifier`", ->
    			[idForkFn, idForkSpy] = [@ITC.Identifier.join, @ITC.Identifier.fork = sinon.spy => [(new @ITC.Identifier), (new @ITC.Identifier)]]

    			id = new @ITC.Identifier
    			@ITC.fork new @ITC id
    			(expect idForkSpy.calledOnce).to.equal true
    			(expect idForkSpy.args[0][0]).to.equal id

    			@ITC.Identifier.fork = idForkFn

    	describe "its instances", ->
    		it "should have an `event` prototype method that calls the `event` class method", ->
    			(expect @ITC.prototype).to.have.a.property 'event'
    				.that.is.a 'function'

    			[eventFn, eventSpy] = [@ITC.event, sinon.spy => new @ITC]
    			@ITC.event = eventSpy
    			itc = new @ITC
    			@ITC.prototype.event.call itc
    			(expect eventSpy.calledOnce).to.equal true
    			(expect eventSpy.args[0][0]).to.equal itc

    			@ITC.event = eventFn

    		it "should have a `fork` prototype method that calls the `fork` class method", ->
    			(expect @ITC.prototype).to.have.a.property 'fork'
    				.that.is.a 'function'

    			[forkFn, forkSpy] = [@ITC.fork, sinon.spy => [(new @ITC), (new @ITC)]]
    			@ITC.fork = forkSpy
    			itc = new @ITC
    			@ITC.prototype.fork.call itc
    			(expect forkSpy.calledOnce).to.equal true
    			(expect forkSpy.args[0][0]).to.equal itc

    			@ITC.fork = forkFn

    	it "should join, event, and fork arbitrary ITCs into arbitrary ITCs", ->
    		#NB. From Almeida et al, 2008, top of p6
    		itcA = new @ITC (new @ITC.Identifier true)

    		[itcB, itcC] = @ITC.fork itcA
    		(expect itcB).to.equalITC _identifier: [true, false], _event: 0
    		(expect itcC).to.equalITC _identifier: [false, true], _event: 0

    		itcD = @ITC.event itcB
    		(expect itcD).to.equalITC _identifier: [true, false], _event: [0, 1, 0]

    		itcE = @ITC.event itcC
    		(expect itcE).to.equalITC _identifier: [false, true], _event: [0, 0, 1]

    		[itcF, itcG] = @ITC.fork itcD
    		(expect itcF).to.equalITC _identifier: [[true, false], false], _event: [0, 1, 0]
    		(expect itcG).to.equalITC _identifier: [[false, true], false], _event: [0, 1, 0]

    		itcH = @ITC.event itcE
    		(expect itcH).to.equalITC _identifier: [false, true], _event: [0, 0, 2]

    		itcI = @ITC.event itcF
    		(expect itcI).to.equalITC _identifier: [[true, false], false], _event: [0, [1, 1, 0], 0]

    		itcJ = @ITC.join itcG, itcH
    		(expect itcJ).to.equalITC _identifier: [[false, true], true], _event: [1, 0, 1]

    		[itcK, itcL] = @ITC.fork itcJ
    		(expect itcK).to.equalITC _identifier: [[false, true], false], _event: [1, 0, 1]
    		(expect itcL).to.equalITC _identifier: [false, true], _event: [1, 0, 1]

    		itcM = @ITC.join itcI, itcK
    		(expect itcM).to.equalITC _identifier: [true, false], _event: [1, [0, 1, 0], 1]

    		itcN = @ITC.event itcM
    		(expect itcN).to.equalITC _identifier: [true, false], _event: 2
