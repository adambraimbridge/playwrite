const getConversation = async ({ abslackt, name, playerId }) => {
	const existing = await abslackt.getConversation({ name, playerId })
	if (!!existing) {
		conversation = existing.conversation
	} else {
		const created = await abslackt.createConversation({ name, playerId })
		conversation = created.conversation
	}
	return { conversation }
}
module.exports = {
	getConversation,
}
