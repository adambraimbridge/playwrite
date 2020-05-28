const getUser = async ({ slackWebClient, user }) => {
	const response = await slackWebClient.users //
		.info({ user })
		.catch(console.error)

	return response.user
}

module.exports = {
	getUser,
}
