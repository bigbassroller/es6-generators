// Superagent example
superagent.get('http://google.com', function(error, res) {
	// Handle error, use res
});

// Co example
const co = require('co');
const superagent = require('superagent');

co(function*() {
	const html = (yield superagent.get('http://www.google.com')).text;
 // HTML for Google home page
 html;
});

//Promises and thunks

// a thunk is a asynchronous function that takes a single parameter, a callback

// from previous chapter
const async = function(callback) {
	setTimeout(() => callback(new Error('Oops')), 10)
};

// the superagent function takes a parameter and a callback,
// so it is not a thunk
superagent.get('http://google.com', function(error, res) {
	// Handle error, use res
});

// with arrow functions you can easily convert any asynchronous function
// call to a thunk.
co(function*() {
	yield (callback) => { superagent.get('http://google.com', callback); };
});


// The thunkify library by TJ Holowaychuk, converts a general asynchronous
// function into a thunk to use with co.

// The thunkify function takes a single parameter, an asynchronous function,
// and returns a function that returns a thunk.

// Thunkify with co example:
const co = require('co');
const superagent = require('superagent');
const thunkify = require('thunkify');

co(function*() {
	const thunk = thunkify(superagent.get)('http://www.google.com');
	//function
	typeof thunk;
	// A function's lenght property contains the number of parameters
	// In this case, 1
	thunk.length;
	const html = yield thunk;
	// HTML for Google's home page
	html;
}).catch(error => done(error));

// A simple implementation of thunkify in 9 lines of code
const co = require('co');
const superagent = require('superagent');

const thunkify = function(fn) {
	// Thunkify returns a function that takes some arguments
	return function() {
		// The function gathers the arguments
		const args = [];
		for (const arg of arguments) {
			args.push(arg);
		}
		// And returns a thunk
		return function(callback) {
			// The thunk calls the original function witht you arguments 
			// plus the callback
			return fn.apply(null, args.concat([callback]));
		};
	};
};

co(function*() {
	const thunk = thunkify(superagent.get)('http://www.google.com');
	//
	const html = yield thunk;
	// HTML for Google's home page
	html;
});


// When you call thunkify(), that function loses its value of this
Class Test {
	async(callback) {
		return callback(null, this);
	}
}

co(function*() {
	const test = new Test();
	const res = yield thunkify(test.async)();
	// Woops, res refers to global object rather than the 'test'
	// variable
	assert.ok(res !== test);
	done();
});

// Calling
a.b();
// is different from:
var c = a.b; c();

// 'this' will will equal 'a'
a.b()

// 'this' refers to the global object 'c'
car c = a.b; c();

// this applies to what happens when you pass a 
// function as a parameter to another function

// you could use bind to make it better:
const res = yield thunkify thunkify(test.async.bind(test))();

// but it can get confusing with chained function calls. 
a.b().c().d() 
// and the 
b().c()
// and
d()
// are chained together. 

// Chained functions are used to build Complex objects, 
// like HTTP request or MongoDB queries.

// Superagent has a chainable api for building HTTP requests

// Create an arbitrary complex HTTP request o show how superagent's 
// request builder works.
superagent.
	get('http://google.com').
	// Set the HTTP Authorization header
	set('Authorization', 'MY_TOKEN_HERE').
	// Only allow 5 http redirects before failing
	redirects(5).
	// Add `?color=blue` to the URL
	query({ color: blue}).
	// Send the request
	end(function(error, res) {});

	// Where would you need to use .bind() and what would you bind to?

	// You would need to .bind() to the return value of superagent.get().
	co(function*() {
		const req = superagent.get('http://google.com');
		const res = yield thunkify(req.query({ color: blue}).end.bind(req));
	});

// co supports promises

// Promise is an object that has a .then() function that 
// takes two functions as parameters, onFulfilled and onRejected. 

// Promises vs Thunk pros and cons:

// Thunkify:
// Pro: You make no assumption about the function you are calling.
// Con: Messes up this. You have to use .bind() which can be 
// unintuitive where to put unless reading library source code.

// Pro:
// Does not mess up the value of this. 
// Used by many libraries.

// Cons:
// you rely on the function itself to return a promise.

// example, each function call in the supeagent HTTP request builder 
// returns a promise that you can yield.
co(function*() {
	// `superagent.get()` returns a promise, because the `.then` property
	// is a function.
	superagent.get('http://www.google.com').then;
	co(function*() {
		// Works because co is smart enough to look for a `.then()` function
		const res = yield superagent.
			get('http://www.google.com').
			query({ color: 'blue'});
	});
});


// The promise constructor takes on a single function, called a resolver, 
// which takes two function parameters, resolve() and reject().

// The resolver function takes 2 parameters, a `resolve()` function
// and a `reject()` function.
const resolver = function(resolve, reject) {
	// Call `resolve()` asynchronously with a value
	setTimeout(() => resolve('Hello, World'), 5);
};
const promise = new Promise(resolver);
promise.then(function(res) {
	// the promise's `onFulfilled` function gets call with
	// the value the resolver passed to `resolve()`. In this
	// case, the string 'Hello, World!'
	res;
});


// A minimal promise that is compatitble with co

cosnt promise = {
	then: function(onFulfilled, onRejected) {
		setTimeout(() => onFulfilled('Hello, World!'), 0);
	}
};

co(function*() {
	const str = yield promise;
	assert.equal(str, 'Hello, World!');
});


// Write Your Own Co

const fo = function(generatorFunction) {
	const generator = generatorFunction();
	next();

	function next(v, isError) {
		const res = isError ? generator.throw(v) : generator.next(v);
		if (res.done) {
			return;
		}
		handleAsync(res.value);
	}

	// Handle the result the generator yielded
	function handleAsync(async) {
		if (async && async.then) {
			handlePromise(async);
		} else if (typeof async === 'function') {
			handleThunk(async);
		} else {
			next(new Error(`Invalid yield ${async}`), true);
		}
	}

	function handlePromise(async) {
		async.then(next, (error) => next(error, true));
	}

	function handleThunk(async) {
		async((error, v) => {
			error ? next(error, true) : next(v);
		});
	}
};

// fo in action
fo(function*() {
	const html = (yield superagent.get('http://www.google.com')).text;
});


// How fo works with a simple error
fo(function*() {
	try {
		// First iteration of `next()` stops here,
		// calls `.then()` on the promise
		const res = yield superaget.get('http://doesnot.exist.daddomain');
	} catch (error) {
		// The promise was rejected, so fo calls `generator.throw()` and 
		// you end up here.
	}

	// Second interation of `next()` stops here, `.then()` on the promise
	const res = yield superagent.get('http://www.google.com');
	res.text;
	// Third interation of `next()` stops here because generator is done
});

// Asynchronous coroutines allow to retry failed HTTP requests
// with a for loop:

fo(function*() {
	const url = 'http://doesnot.exist.baddomain';
	const NUM_RETRIES = 3
	let res;
	for (let i = 0; i < 3; ++i) {
		try {
			// Going to yield 3 times, and `fo()` will call
			// `generator.throw() 3 times because superagent will
			// fail every time`
			res = yield superagent.get(url);
			break;
		} catch (error) {/* retry */}
	}
	// res is undefined = retried 3 times with no results
});


// Limitations
// uncaught errors crashes
try {
	fo(function*() {
		// This throw an uncaught asynchrounous exception
		// and crash the process!
		yield superagent.get('http://doesnot.exist.baddomain');
	});
} catch (error) {
	// this try/catch won't catch the error within the `fo()` call!
}


//Limitation:
// Fo() v1 doesn't support retry() for fixed number of times,
// even with yielding generators

//Needs  to be a generator function so you can `yield` in it.
const retry = function*(fn, numRetries) {
	for (let i = 0; i < numRetries; ++i) {
		try {
			const res = yield fn();
			return res;
		} catch (error) {}
	}
	throw new Error(`Retried ${numRetries} times`);
};

fo(function*() {
	const url = 'http://www.google.com';
	// Fo's `hangleAsync` function will throw because you're
	// yielding a generator function!
	const res = yield retry(() => superagent.get(url), 3);
});

// Limitation:

// Doesn't allow parallelism.

fo(function*() {
	const google = yield superagent.get('http://www.google.com');
	const amazon = yield superagent.get('http://www.amazon.com');
});


// fo v2
// Useses promises internally and returns a promise

const fo = function(input) {
	const isGenerator = (v) => typeof v.next() === 'function';
	const isGeneratorFunction = 
		(v) => v.constructor && v.constructor.name === 'GeneratorFunction';

	let generator;
	if(isGenerator(input)) generator = input;
	if(isGeneratorFunction(input)) generator = input();
	if(!generator) throw `Invalid parameter to fo() ${input}`;

	return new Promise((resolve, reject) => {
		next();

		// Call next() or throw() on the generator as necessary
		function next(v, isError) {
			let res;
			try {
				res = isError ? generator.throw(v) : generator.next(v)
			} catch (error) {
				return reject(error);
			}
			if (res.done) {
				return resolve(res.value);
			}
			toPromise(res.value).then(next, (error) => next(error, true));
		}

		
		// Convert v to a promise. If invalid, returns a rejected promise
		function toPromise(v) {
			if(isGeneratorFunction(v) || isGenerator(v)) return fo(v);
			if (v.then) return v;
			if (typeof v === 'function') {
				return new Promise((resolve, reject) => {
					v((error, res) => error ? reject(error) : resolve(res));
				});
			}
			if (Array.isArray(v)) return Promise.all(v.map(toPromise));
			return Promise.reject(new Error(`Invalid yield ${v}`));
		}
	});
};


// Key parts (and a limitation)
let res;
try {
	res = isError ? generator.throw(v) : generator.next(v);
} catch (error) {
	return reject(error);
}

// every error that could occur synchronously 
const superagent = require('superagent');

fo(function*() {
	const html = yield superagent.get('http://doesnot.exist.baddomain');
}).then(null, (error) => {
	// Caught the HTTP error!
});

// Using a .catch() instead, which enables you to yield generators
// and generatorFunction()
const superagent = require('superagent');

fo(function*() {
	const html = yield superagent.get('http://www.google.com');
	// throws a TypeError, because `html.notARealProperty` is undefined
	const v = html.notARealProperty.test;
}).catch((error) => {
	// Caught the TypeError
});

// Now you can catch TypeErrors
const superagent = require('superagent');

fo(function*() {
	const html = yield superagent.get('http://www.google.com');
	// Throws a TypeError, because `html.notARealProperty` is undefined
	const v = html.notARealProperty.test;
}).catch((error) => {
	// Caught the TypeError!
});


// Co more robust, for example and not to be used in production:
const isGenerator = (v) => typeof v.next === 'function';
const isGeneratorFunction = 
(v) => v.constructor && v.constructor.name === 'GeneratorFunction';


// the toPromise() function can call foo() recursively to convert 
// the generator you yielded into a promise.

// Convert v to a promise. If invalid, returns a rejected promise
function toPromise(v) {
	if (isGeneratorFunction(v) || isGenerator(v)) return fo(v);
}

// Now you can write helper functions that yield, as long as the helper
// function is a generator function too:
const get = function*() {
	return (yield superagent.get('http://www.google.com')).text;
};
// fo v2 in action. Note that you're yielding a generator!
fo(function*() {
	// Get the HTML for Google's home page
	const html = yield get();
}).catch((error) => done(error));

// Above example allows request in parallel. If you yield an array, fo 
// will execute the array in parallel.

// Magic is in the toPromise()

// Convert v to a promise. If invalid, returns a rejected promise
function toPromise(v) {
	if (isGenerator(v) || isGenerator(v)) return fo(v);
	if (v.then) return v;
	if (typeof v === 'function') {
		return new Promise((resolve, reject) => {
			v((error, res) => error ? reject(error) : resolve(res));
		});
	}
	// Magic array handler
	if (Array.isArray(v)) return Promise.all(v.map(toPromise));
	return Promise.reject(new Error(`Invalid yield ${v}`));
}

// .Promise.all() takes an array of promises and converts them to 
// a single promise. The above example uses .map() function to convert
// every element in the array to a promise.

// This means you now able to do HTTP requests in parallel.

const superagent = require('superagent');
fo(function*() {
	const google = superagent.get('http://www.google.com');
	const amazon = superagent.get('http://amazon.com');
	// Parallel HTTP requests!
	const res = yield [google, amazon];
});

// Summary:
//- Use co().catch() to catch all errors, not just promise rejections
//- Parallelism is possible by yielding an array.
//- Use try/catch to prevent errors stopping execution.
//- Helper functions can be generator functions by using yield.

// Summary example:
const co = require('co');
const superagent = require('superagent');

co(function*() {
	let res;
	try {
		res = yield superagent.get('http://www.google.com');
	} catch (error) {
		res = getCached();
	}

	// Any errors with this get sent to handleError
	// The `persitToDB()` function is a generator function.
	yield persistToDB(res.text);
}).catch(handleError);







































































