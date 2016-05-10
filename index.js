# es6-generators

// Generator function hello world

const generatorFunction = function*() {
	console.log('Hello, World!');
}; // returns undefined

generatorFunction()
// {}

generatorFunction().next()
// Hello, World! { value: undefined, done: true }

// yield hello world

const generatorFunction = function*() {
	yield 'Hello, World!';
}; // undefined

const generator = generatorFunction(); // undefined

generator = generatorFunction();  // undefined

generator.next(); // { value: 'Hello, World', done: false }

generator.next(); // { value: undefined, done: true }

// "yield is the equivalent of the return statement"

const generatorFunction = function*() {
	let message = 'Hello';
	yield message;
	message += ', World';
	yield message;
};

const generator = generatorFunction(); // {value: 'Hello', done: false };

const v1 = generator.next(); // { value: undefined, done: true } 

const v2 = generator.next(); // { value: undefined, done: true }

const v3 = generator.next();

// "A generator is actually an instance of a more general ES2015 concept called and an interator. An interator is any JavaScript object that has a next() function that returns { value: Any, done: Boolean }." 


// Re-entry
const generatorFunction = function*() {
	let i = 0;
	while (i < 3) {
		yield i;
		++i;
	}
};

const generator = generatorFunction();

let x = generator.next(); // {value: 0, done: false }
setTimeout(() => {
	x = generator.next(); // { value: 1, done: false }
	x = generator.next(); // { value: 2, done: false }
	x = generator.next(); // { value: undefined, done: true }
}, 50);

// Yield vs return revisited

const generatorFunction = function*() {
	return 'Hello, World!';
};

const generator = generatorFunction();

const v = generator.next(); // { value: 'Hello, World!' done: true }

// Async Fibonacci

const fibonacciGenerator = function = function*(n) {
	let back2 = 0;
	let back1 = 1;
	let cur = 1;
	for (let i = 0; i < n - 1; ++i) {
		cur = back2 + back1;
		back2 = back1;
		back1 = cur;
		yield cur;
	}

	return cur;
};

// compute synchronously

const fibonacci = fibonacciGenerator(10);
let it;
for (it = fibonacci.next(); !it.done; it = fibonacci.next()) {}
it.value; // 55, the 10th fibonacci number

// compute asynchronous
const fibonacci = fibonacciGenerator(10);
// And compute one new Fibonacci number with each iteration through the loop
const interval = setInterval(() => {
	const res = fibonacci.next();
	if (res.done) {
		clearInterval(interval);
		res.value;  // 55, the 10th fibonacci number
	}
}, 0);

// For/of Loops
let fibonacci = fibonacciGenerator(10);
for (const x of fibonacci) {
	x; //1, 1, 2, 3, 5, .../ 55
}

// Iterators and Iterables

//Iterator: is any JavaScript object that has a next() function that returns { value: Any, done: boolean }. You can also interate over arrays.
for (const x of [1, 2, 3]) {
	x; // 1, 2, 4
}

//Iterable: is an object that has a Symbol.iterator property which is a function that returns an iterator. In other words, when you execute a For/Of loop, the JavaScript interpreter looks for a Symbol.interator property on the object you're looping of.
let iterable = {};
for (const x of iterable) {} // Throws an error

// But once you add a Symbol.iterator property, everything works!
iterable[Symbol.interator] = function() {
	return fibonacciGenerator(10);
};
for (const x of iterable) {
	x; // 1, 1, 2, 3, 5, ..., 555
}


// symbols don't appear in the output of Object.keys()
Symbol.iterator; // Symbol(Symbol.iterator)

let iterable = {};
iterable[Symbol.iterator] = function() {
	return fibonacciGenerator(10);
};

iterable.iterator; // undefined

object.keys(iterable); // Empty arrys


// Iterables and Generators

// Generator objects are iterables, not generator functions.
// you can't run a for/of loop on a generator function.

fibonacciGenerator[Symbol.iterable]; // Undefined
fibonacciGenerator(10)[Symbol.iterable]; // Function

for (const x of fibonacciGenerator) {} // Error!
for (const x of fibonacciGenerator(10)) {} // OK

//Once a generator is done, subsequent for/of loops will exit immediately.
const fibonacci = fibonacciGenerator(10);
fibonacci[Symbol.iterator]() === fibonacci; // true
for (const x of fibonacci) {
	// 1, 1, 2, 3, 5, ..., 55
}
for (const x of fibonacci) {
	// Doesn't run!
}


// Error Handling

const generatorFunction = function*() {
	throw new Error('oops!');
};

const generator = generatorFunction();

// throws an error
generator.next();

// If you call next() asynchronously, you will lose the original stack trace.

const generatorFunction = function*() {
	throw new Error('oops!');
};

const generator = generatorFunction();

setTimeout(() => {
	try {
		generator.next();
	} catch (err) {
		/**
		* Error: oops!
		* at generatorFunction (books.js:2:15)
		* at next (native)
		* at null._onTimeout (book.js:18:21)
		* at Timer.lisOnTimeout (timers.js:89:15)
		*/
		err.stack;
	}
}, 0);

// Re-entry With Error

// You can use throw() function to give the calling functin back control
// with a try/catch

const fakeFibonacciGenerator = function*() {
	try {
		yield 3;
	} catch (error) {
		error; // Error : expected 1, got 3
	}
};
const fibonacci = fakeFibonacciGenerator();

const x = fibonacci.next();
fibonacci.throw(new Error(`Expected 1, got ${x.value}`));
// { value: undefined, done: true }
fibonacci.next();

// Case Study: Handling Async Errors

// The next() function can take a parameter that then becomes the 
// return value of the yield statement
const generatorFunction = function*() {
	const fullName = yield ['John', 'Smith'];
	fullName; // 'John Smith'
};

const generator = generatorFunction();
// Execute up to the first `yield`
const next = generator.next();
// Join ['John', 'Smith'] => 'John Smith' and use it as the 
// result of `yield`, the execute the rest of the generator function
generator.next(next.value.join(' '));

// Run a Generator function that yields an asynchronous function without any errors.
const async = function(callback) {
	setTimeout(() => callback(null, 'Hello, Async!'), 10);
};

const generatorFunction = function*() {
	const v = yield async;
	v: // 'Hello, Async!'
};

const generator = generatorFunction(); 
const res = generator.next();
res.value(function(error, res) {
	generator.next(res);
});

// Now it can call throw() asynchronously with try/catch. This is the basis
// of the co library.

const async = function(callback) {
	setTimeout(() => callback(new Error('Oops!')), 10);
};

const generatorFunction = function*() {
	try {
		yield async;
	} catch (error) {
		error; // Error: Oops!
	}
};

const generator = generatorFunction();
const res = generator.next();
res.value(function(error, res) {
	generator.throw(error);
});














