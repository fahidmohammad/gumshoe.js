describe("XHR requests", function() {

	beforeEach(function() {
		Gumshoe.debug = true;
	});

	afterEach(function() {
		Gumshoe.debug = false;
	});

	it ("should return an XHR object", function() {
		expect(Gumshoe.getXHR)
			.not
			.toBeFalsy();
	});

});

describe("Posting a standard AJAX call", function() {

	beforeEach(function() {
		jQuery = jasmine.createSpyObj('jQuery', ['ajax']);
	});

	afterEach(function() {
		jQuery = null;
	});

	it ("should rely on jQuery", function() {
		expect(jQuery.ajax)
			.toBeDefined();

		jQuery.ajax = jasmine.createSpy('ajax').andCallFake(function(obj) {
			obj.success();
		});

		expect(Gumshoe.post({ 'foo' : 'bar' }, false))
			.toBeTruthy();

		expect(jQuery.ajax)
			.toHaveBeenCalled();
	});

	it ("should retry twice when a bad status code is returned", function() {
		expect(jQuery.ajax)
			.toBeDefined();
		
		var counter = 0;

		jQuery.ajax = jasmine.createSpy('ajax').andCallFake(function(obj) {
			obj.error();
			counter++;
		});

		expect(Gumshoe.post({ 'foo' : 'bar' }, false))
			.toBeFalsy();

		expect(counter)
			.toEqual(3);
	});

});

describe("Posting a raw AJAX call", function() {

	var getXHRBackup;

	var xhrReturn = {
		open: function() { },
		setRequestHeader: function() { },
		onreadystatechange: function() { },
		send: function(data) {
			this.onreadystatechange();
		}
	};

	beforeEach(function() {
		getXHRBackup = Gumshoe.getXHR;

		Gumshoe.getXHR = jasmine.createSpy('getXHR').andReturn(xhrReturn);

		xhrReturn.readyState = 4;
		xhrReturn.status = 200;
	});

	afterEach(function() {
		Gumshoe.getXHR = getXHRBackup;
	});

	it ("should fail if the XHR is invalid", function() {
		Gumshoe.getXHR = jasmine.createSpy('getXHR').andReturn(false);

		expect(Gumshoe.getXHR)
			.toBeDefined();

		expect(Gumshoe.postRaw({ 'foo' : 'bar' }, false))
			.toBeFalsy();

		expect(Gumshoe.getXHR)
			.toHaveBeenCalled();
	});

	it ("should fail if the XHR is in a failure state", function() {
		expect(Gumshoe.getXHR)
			.toBeDefined();

		xhrReturn.readyState = 1;

		expect(Gumshoe.postRaw({ 'foo' : 'bar' }, false))
			.toBeFalsy();

		expect(Gumshoe.getXHR)
			.toHaveBeenCalled();
	});

	it ("should retry twice when a bad status code is returned", function() {
		expect(Gumshoe.getXHR)
			.toBeDefined();

		xhrReturn.status = 404;
		
		expect(Gumshoe.postRaw({ 'foo' : 'bar' }, false))
			.toBeFalsy();

		expect(Gumshoe.getXHR.callCount)
			.toEqual(3);
	});

	it ("should be successful if the XHR returns well", function() {
		expect(Gumshoe.getXHR)
			.toBeDefined();

		expect(Gumshoe.postRaw({ 'foo' : 'bar' }, false))
			.toBeTruthy();

		expect(Gumshoe.getXHR)
			.toHaveBeenCalled();
	});

});


describe("Posting an AJAX call in IE", function() {

	var xdrReturn = {
		open: function() { }
	};

	beforeEach(function() {
		global = {};
		global.XDomainRequest = jasmine.createSpy(global, 'XDomainRequest').andReturn(xdrReturn);

		xdrReturn.send = function() { };
	});

	afterEach(function() {
		global.XDomainRequest = null;
		global = null;
	});

	it ("should retry twice when a bad status code is returned", function() {
		expect(global.XDomainRequest)
			.toBeDefined();

		xdrReturn.send = function() {
			this.onerror();
		};
		
		expect(Gumshoe.postIE({ 'foo' : 'bar' }))
			.toBeFalsy();

		expect(global.XDomainRequest.callCount)
			.toEqual(3);
	});

	it ("should be successful if the XDR returns well", function() {
		expect(global.XDomainRequest)
			.toBeDefined();

		expect(Gumshoe.postIE({ 'foo' : 'bar' }))
			.toBeTruthy();

		expect(global.XDomainRequest)
			.toHaveBeenCalled();
	});

});


// fireRequest

// postIE