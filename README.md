# es6-generators notes on [The 80/20 Guide to ES2015 Generators with Valeri Karpov](http://es2015generators.com/)

see index.js for list of examples

Difinitions:
Iterator: is any JavaScript object that has a next() function that returns { value: Any, done: boolean }.

Iterable: is an object that has a Symbol.iterator property which is a function that returns an iterator.  

interable[Symbol.iterator]: A unique identifier of an interable, is an object that has a Symbol.iterator property which is a function that returns an iterator. In other words, when you execute a For/Of loop, the JavaScript interpreter looks for a Symbol.interator property on the object you're looping of.

Thunk:  a thunk is a asynchronous function that takes a single parameter, a callback

Promise is an object that has a .then() function that takes two functions as parameters, onFulfilled and onRejected

.catch(): Shorthand for .then() with no onFulfilled handler.

 .Promise.all() takes an array of promises and converts them to a single promise.