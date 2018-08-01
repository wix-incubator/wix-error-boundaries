
const errorBoundaries = require('../index')

const SCOPE_A = 'scopeACodeZone'
const SCOPE_B = 'scopeBCodeZone'

describe('Wix Error Boundaries Testing Suite', () => {

	const errorThrown = new Error('error Thrown')
	const errorRejected = new Error('error Rejected')

	test('that scoped functions are running and throwing errors under their own scope ', async () => {
		const myErrorHandler = jest.fn()

		const {scopeACodeZone, scopeBCodeZone} = errorBoundaries({
			scopes: [SCOPE_A, SCOPE_B],
			errorHandler: myErrorHandler
		})

		// synchronous function
		const underScopeAFunction = scopeACodeZone(() => {throw errorThrown})

		// asynchronous function
		const underScopeBFunction = scopeBCodeZone(() => Promise.reject(errorRejected))

		expect(() => underScopeAFunction()).not.toThrow()
		expect(myErrorHandler).toHaveBeenCalledTimes(1)
		expect(myErrorHandler).toHaveBeenCalledWith(errorThrown, SCOPE_A)
		await expect(underScopeBFunction()).resolves.toBeUndefined()
		expect(myErrorHandler).toHaveBeenCalledTimes(2)
		expect(myErrorHandler).toHaveBeenLastCalledWith(errorRejected, SCOPE_B)
	 })

	test('that all arguments are passed to the wrapped function by order', async () => {
		const myErrorHandler = jest.fn()
		const foo = jest.fn()

		const {scopeACodeZone} = errorBoundaries({
			scopes: [SCOPE_A, SCOPE_B],
			errorHandler: myErrorHandler
		})

		const scopedFoo = scopeACodeZone(foo)
		scopedFoo(1, 'string', true)
		expect(foo).toHaveBeenCalledTimes(1)
		expect(foo).toHaveBeenCalledWith(1, 'string', true)
	})

	test('that the scoped wrapped function executing normally and returning value', async () => {
		const myErrorHandler = jest.fn()
		const multiply = (x, y) => x * y

		const {scopeACodeZone} = errorBoundaries({
			scopes: [SCOPE_A, SCOPE_B],
			errorHandler: myErrorHandler
		})

		const scopedFoo = scopeACodeZone(multiply)
		expect(scopedFoo(3, 4)).toBe(12)
	})
})
