
function isPromise(something) {
	return something && typeof something.then === 'function'
}

const errorScopingFactory = (scope, errorHandler) => func => (...args) => {
	try {
		const result = func(...args)
		if (isPromise(result)) {
			return result.catch(e => {
				errorHandler(e, scope)
			})
		}

		return result
	} catch (e) {
		errorHandler(e, scope)
	}
}

function errorBoundaries({ scopes, errorHandler }) {
	const boundaries = {}
	scopes.forEach(scope => {
		boundaries[scope] = errorScopingFactory(scope, errorHandler)
	})

	return boundaries
}

module.exports = errorBoundaries
