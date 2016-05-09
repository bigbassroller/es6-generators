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

// A Brief Overview of Symbols










