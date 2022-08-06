# Global Registry

Simple registry for creating and reusing globally shared objects 


# Example 1 : sharing

```javascript

const GlobalReg = require( '@debonet/es6globalreg' );

class MyClass{}

const a = await GlobalReg.get( "foo", () => new MyClass());
const b = await GlobalReg.get( "foo", () => new MyClass());

console.log( a === b ); // true
```

# Example 2 : releasing

```javascript

const GlobalReg = require( '@debonet/es6globalreg' );

class MyClass{}

const a = await GlobalReg.get( "foo", () => new MyClass());
const b = await GlobalReg.get( "foo", () => new MyClass());

// release only one copy
await GlobalReg.release( a );

// new get()'s share the global version
const c = await GlobalReg.get( "foo", () => new MyClass());
console.log( c === b ); // true

// release all copies
await GlobalReg.releaseAll( b );

// new get()'s don't share any more
const d = await GlobalReg.get( "foo", () => new MyClass());

console.log( c === d ); // false;

```


# API

## GlobalReg.fxGet( signature, create_function ) 
## GlobalReg.get( signature, create_function ) 


| _*signature*_ string - A unique string identifier for this resource

| _*create_function*_ - function() - A function with no arguments that gets called if the resource does not already exist


Creates a new object and adds it to the registry if none is found. 

Returns a promise to deliver the gloablly registered object.


## GlobalReg.fRelease( x, cleanup_function, all ) 
## GlobalReg.release( x, cleanup_function, all ) 


| _*x*_ - object - The object to be released from the registry

| _*cleanup_function*_ - optioanl function() defaults to  () => {}` - A function with no arguments that gets called if all outstanding instances have been released

| _*all*_ - optioanl boolean - A function with no arguments that gets called if all outstanding instances have been released

Reduces the count the provided object. If no more instances are outstanding, will call the provided cleanup function

Returns a promise that resolves to the remaining count

## GlobalReg.fReleaseAll( x, cleanup_function ) 
## GlobalReg.releaseAll( x, cleanup_function ) 

shorthand for `GlobalReg.fRelease( x, cleanup_function, true )`


## GlobalReg.fcInstances( x )
## GlobalReg.instances( x )

| _*x*_ - object - The object of interest

Returns the count of outstanging instances of the indicated object in the registry

