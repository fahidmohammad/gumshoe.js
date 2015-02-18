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
		readyState: 1,
		statusCode: 200,
		open: function() { },
		setRequestHeader: function() { },
		onreadystatechange: function() { },
		send: function(data) {
			this.onreadystatechange();
		}
	};

	beforeEach(function() {
		Gumshoe.debug = true;

		getXHRBackup = Gumshoe.getXHR;

		Gumshoe.getXHR = jasmine.createSpy('getXHR').andReturn(xhrReturn);
	});

	afterEach(function() {
		Gumshoe.getXHR = getXHRBackup;
		Gumshoe.debug = false;
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

		xhrReturn.readyState = 4;
	});

	it ("should retry twice when a bad status code is returned", function() {
		expect(Gumshoe.getXHR)
			.toBeDefined();

		xhrReturn.statusCode = 404;
		
		expect(Gumshoe.postRaw({ 'foo' : 'bar' }, false))
			.toBeFalsy();

		expect(Gumshoe.getXHR.callCount)
			.toEqual(3);

		xhrReturn.statusCode = 200;
	});

});


// fireRequest

