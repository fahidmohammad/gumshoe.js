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

		jQuery.ajax = jasmine.createSpy('jQuery.ajax').andCallFake(function(obj) {
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

		jQuery.ajax = jasmine.createSpy('jQuery.ajax').andCallFake(function(obj) {
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

		Gumshoe.getXHR = jasmine.createSpy('Gumshoe.getXHR').andReturn(xhrReturn);

		xhrReturn.readyState = 4;
		xhrReturn.status = 200;
	});

	afterEach(function() {
		Gumshoe.getXHR = getXHRBackup;
	});

	it ("should fail if the XHR is invalid", function() {
		Gumshoe.getXHR = jasmine.createSpy('Gumshoe.getXHR').andReturn(false);

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
		global.XDomainRequest = jasmine.createSpy('XDomainRequest').andReturn(xdrReturn);

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


describe("Firing a request", function() {

	var errorHandler, postHandler, postRawHandler, postIEHandler, differentOriginHandler, oldEndpoint;

	beforeEach(function() {
		errorHandler = Gumshoe.logError;
		postHandler = Gumshoe.post;
		postRawHandler = Gumshoe.postRaw;
		postIEHandler = Gumshoe.postIE;

		Gumshoe.logError = jasmine.createSpy('Gumshoe.logError');
		Gumshoe.post = jasmine.createSpy('Gumshoe.post');
		Gumshoe.postRaw = jasmine.createSpy('Gumshoe.postRaw');
		Gumshoe.postIE = jasmine.createSpy('Gumshoe.postIE');

		differentOriginHandler = Gumshoe.isDifferentOrigin;

		oldEndpoint = Gumshoe.endpoint;

		global = {};
	});

	afterEach(function() {
		Gumshoe.logError = errorHandler;
		Gumshoe.post = postHandler;
		Gumshoe.postRaw = postRawHandler;
		Gumshoe.postIE = postIEHandler;

		Gumshoe.isDifferentOrigin = differentOriginHandler;

		Gumshoe.endpoint = oldEndpoint;
	});

	it ("should log a warning if there is no data", function() {
		Gumshoe.fireRequest();
		Gumshoe.fireRequest([]);

		expect(Gumshoe.logError.callCount)
			.toEqual(2);
	});

	it ("should log a warning if there is no endpoint", function() {
		Gumshoe.endpoint = '';
		Gumshoe.fireRequest([1, 2, 3], false);

		Gumshoe.endpoint = null;
		Gumshoe.fireRequest([1, 2, 3], false);

		Gumshoe.endpoint = false;
		Gumshoe.fireRequest([1, 2, 3], false);

		expect(Gumshoe.logError.callCount)
			.toEqual(3);
	});

	it ("should correctly tell if the request is to the same absolute origin", function() {
		Gumshoe.isDifferentOrigin = jasmine.createSpy('Gumshoe.isDifferentOrigin').andReturn(false);

		Gumshoe.endpoint = 'http://www.example.com/';
		Gumshoe.fireRequest([1, 2, 3], false);

		expect(Gumshoe.post)
			.toHaveBeenCalled();
	});

	it ("should correctly tell if the request is to the same relative origin", function() {
		Gumshoe.isDifferentOrigin = jasmine.createSpy('Gumshoe.isDifferentOrigin').andReturn(false);

		Gumshoe.endpoint = '/test';
		Gumshoe.fireRequest([1, 2, 3], false);

		expect(Gumshoe.post)
			.toHaveBeenCalled();
	});

	it ("should post in a raw format if cross domain", function() {
		Gumshoe.isDifferentOrigin = jasmine.createSpy('Gumshoe.isDifferentOrigin').andReturn(true);

		Gumshoe.endpoint = 'http://www.test.com/';
		Gumshoe.fireRequest([1, 2, 3], false);

		expect(Gumshoe.postRaw)
			.toHaveBeenCalled();
	});

	it ("should post in a raw format if cross protocol", function() {
		Gumshoe.isDifferentOrigin = jasmine.createSpy('Gumshoe.isDifferentOrigin').andReturn(true);

		Gumshoe.endpoint = 'https://www.example.com/';
		Gumshoe.fireRequest([1, 2, 3], false);

		expect(Gumshoe.postRaw)
			.toHaveBeenCalled();
	});

	it ("should handle calls to IE in an IE environment", function() {
		Gumshoe.isDifferentOrigin = jasmine.createSpy('Gumshoe.isDifferentOrigin').andReturn(true);

		global.XDomainRequest = true;

		Gumshoe.fireRequest([1, 2, 3], false);

		expect(Gumshoe.postIE)
			.toHaveBeenCalled();
	});

});