const postMessage = async ({ slackWebClient, view }) => {
	await slackWebClient.chat
		.postMessage(view) //
		.catch(console.error)
}

module.exports = {
	postMessage,
}
