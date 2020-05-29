const plays = [
	require('./ltv-in-the-jungle'), //
	// require('./journalist-or-pugilist'),
]

const getPlay = async ({ playId }) => {
	const foundPlay = plays.find((play) => play.id === playId)
	if (!foundPlay) return false
	return foundPlay
}

// Generate the Slack markup to show the plays on the app homepage.
const getPlayBlocks = async ({ abslackt, user_id }) => {
	console.debug(`🦄 Getting playblocks`)
	return plays.reduce(async (accumulator, { id, title, author, description, score, duration }) => {
		const elements = []
		const conversationName = `${id}-${user_id}`.toLowerCase()
		const existing = await abslackt.getConversation({
			name: conversationName,
			playerId: user_id,
		})
		if (!!existing) {
			conversation = existing.conversation
			elements.push(
				{
					type: 'button',
					text: {
						type: 'plain_text',
						text: 'Restart',
					},
					value: conversation.id,
					action_id: `restart`,
				},
				{
					type: 'button',
					text: {
						type: 'plain_text',
						text: 'Check Messages',
					},
					style: 'primary',
					url: `slack://channel?team=${conversation.shared_team_ids[0]}&id=${conversation.id}`,
					action_id: `messages-link`,
				}
			)
		} else {
			elements.push({
				type: 'button',
				text: {
					type: 'plain_text',
					text: 'Play',
					emoji: true,
				},
				style: 'primary',
				value: '0',
				action_id: `play`,
			})
		}

		accumulator.push({
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `*${title}*`,
			},
		})

		if (!!author) {
			const { profile } = await abslackt.getUser({ user: author })
			const { real_name, image_512: image_url } = profile
			if (!!real_name && !!image_url) {
				accumulator.push({
					type: 'context',
					elements: [
						{
							type: 'image',
							image_url,
							alt_text: real_name,
						},
						{
							type: 'mrkdwn',
							text: `*${real_name}*  |  _${duration}_  |  ${score}`,
						},
					],
				})
			}
		}

		accumulator.push(
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `${description}`,
				},
			},
			{
				type: 'actions',
				block_id: `${id}`,
				elements,
			},
			{
				type: 'divider',
			}
		)

		return accumulator
	}, [])
}

// @todo make some dynamic leaderboards for the homepage
const homepageBlocks = [
	{
		type: 'section',
		fields: [
			{
				type: 'mrkdwn',
				text: '*Top Players*\n<fakelink.toUrl.com|Winston Churchill>\n<fakelink.toUrl.com|Nicole Kidman>\n<fakelink.toUrl.com|Phar Lap>',
			},
			{
				type: 'mrkdwn',
				text: '*Top Plays*\n<fakelink.toUrl.com|LTV in the Jungle>\n<fakelink.toUrl.com|Journalist or Pugilist?>\n<fakelink.toUrl.com|Match the Headline>',
			},
		],
	},
	{
		type: 'context',
		elements: [
			{
				type: 'image',
				image_url: 'https://api.slack.com/img/blocks/bkb_template_images/placeholder.png',
				alt_text: 'placeholder',
			},
		],
	},
	{
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: '*Now Showing*',
		},
		accessory: {
			type: 'overflow',
			options: [
				{
					text: {
						type: 'plain_text',
						text: 'Newest',
						emoji: true,
					},
					value: 'value-0',
				},
				{
					text: {
						type: 'plain_text',
						text: 'Most popular',
						emoji: true,
					},
					value: 'value-1',
				},
				{
					text: {
						type: 'plain_text',
						text: 'Trending',
						emoji: true,
					},
					value: 'value-2',
				},
			],
		},
	},
]

module.exports = {
	plays,
	getPlay,
	getPlayBlocks,
	homepageBlocks,
}
