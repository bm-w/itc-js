# Interval Tree Clock

…

    rewire = require 'rewire'
    expect = (chai = require 'chai').expect

    equalITC = (evB) ->
    	[idTreeA, idTreeB] = [@_obj._identifier.tree ? @_obj._identifier, evB._identifier.tree ? evB._identifier]
    	(expect idTreeA).to.deep.equal idTreeA
    	[evTreeA, evTreeB] = [@_obj._event.tree ? @_obj._event, evB._event.tree ? evB._event]
    	(expect evTreeA).to.deep.equal evTreeA
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
