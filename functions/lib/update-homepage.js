const updateHomepage = async ({ abslackt, user_id }) => {
	console.debug(`🏡 Updating homepage for user #${user_id}`)

	const blocks = await getPlayBlocks({ abslackt, user_id })
	const randomTagline = getRandomTagline()
	blocks.push({
		type: 'context',
		elements: [
			{
				type: 'mrkdwn',
				text: `:performing_arts: _Playwrite._ ${randomTagline}`,
			},
		],
	})

	await abslackt.publish({
		user_id,
		view: {
			type: 'home',
			blocks,
		},
	})
}

module.exports = {
	updateHomepage,
}
