exports.handler = async (request) => {
	if (!request.headers['x-playwrite-api-key'] || request.headers['x-playwrite-api-key'] !== PLAYWRITE_API_KEY) {
		console.warn('🤔 Incorrect or missing x-playwrite-api-key')
		return {
			statusCode: 500,
			body: '🤔 Incorrect or missing key',
		}
	}
}
