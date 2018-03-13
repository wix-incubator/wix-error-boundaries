# Wix Error Boundaries
In many cases, when errors thrown in our code, we want to handle them properly. Sometimes we want to apply an algorithms to resolve the error, in other cases we would like to report them to an external system or maybe just throw again and bubble them up.

Error handling become even more complicated when your app is living under another app context and those two apps may communicate. In this case, errors might be thrown on both sides and then you might be mislead by handling not-yours errors.

Bounding errors by scope or context of the actual running code is crucial when working on mixed app content environment. By using `wix-error-boundaries`, applying such methodology will be easy for you to bound your errors the way you see fit and handle them according to the errors' scope and the way you see fit.

## Install
```
npm install -save wix-error-boundaries
```
## Usage

```javascript
import errorBoundaries from 'wix-error-boundaries'
```

The `errorBoundaries` function accept the following parameters:

* `scopes` - an `Array` of strings which represents the scopes you'd like to bound between
* `errorHandler` - a `Function` with the signature `(error, scope)`, where `error` is the thrown `Error` object and `scope` is the scope the error happened

For the following example, let's assume got an API with functions called `foo` and `fireErrorEvent`.

Now, let's define some scopes:
```javascript
const MY_SCOPE = 'myCodeZone'
const OTHER_SCOPE = 'otherCodeZone'
```
and initialize the error boundaries with our `errorHandler`:
```javascript
const {myCodeZone, otherCodeZone} = errorBoundaries({
	scopes: [MY_SCOPE, OTHER_SCOPE],
	errorHandler: (error, scope) => {
		switch(scope){
			case MY_SCOPE: // do something with my error
				reportToSystem(error)
				break;
			case OTHER_SCOPE: // not my scope so let's do something else
				fireErrorEvent(error)
				break;
			default:
				throw error
		}
	}
})
```
**Pay attention** that the returned object of `errorBoundaries` is actually containing the scopes as keys. Each key value is a wrapping function that will be bound to that certain scope.

Next, to use those wrappers you can do the following<br>

```javascript
const scopedFoo = otherCodeZone(foo)
.
.
.

// safely executing 'foo' while its scoped
scopedFoo()
```
In case `foo` throws an exception, it will be handled in `errorHandler` according to the error scope!


### Have Fun!
