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
		Gumshoe.debug = true;
	});

	afterEach(function() {
		Gumshoe.debug = false;
	});

	it ("should rely on jQuery", function() {
		jQuery = jasmine.createSpyObj('jQuery', ['ajax']);

		expect(jQuery.ajax)
			.toBeDefined();

		Gumshoe.post({ 'foo' : 'bar' }, false);

		expect(jQuery.ajax)
			.toHaveBeenCalled();
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
		xhrReturn.statusCode = 200;
	});

	afterEach(function() {
		Gumshoe.getXHR = getXHRBackup;
	});

	it ("should fail if the XHR is invalid", function() {
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

		xhrReturn.statusCode = 404;
		
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


// fireRequest

// postIE