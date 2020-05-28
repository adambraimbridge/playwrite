// Load application state from the `private_metadata` property.
const getApplicationState = ({ payload }) => {
	const { view } = payload.event ? payload.event : payload
	if (!view) {
		console.warn('🐶 Could not load view.')
		return false
	}

	const { private_metadata } = view
	if (!private_metadata) {
		console.warn('🐶 Could not load applicationState.')
		return false
	}

	let applicationState = {}
	try {
		applicationState = JSON.parse(private_metadata)
	} catch (error) {
		console.warn(error.message)
	}

	return applicationState
}

const setApplicationState = (data) => {
	const clonedData = JSON.parse(JSON.stringify(data))
	return {
		private_metadata: JSON.stringify(Object.assign({}, applicationState, clonedData)),
	}
}

module.exports = {
	getApplicationState,
	setApplicationState,
}
