const { getAbslackt } = require('./abslackt')
const { getPlayBlocks } = require('./plays')
const { getRandomTagline } = require('./branding')

const updateHomepage = async ({ access_token, user_id }) => {
	console.debug(`🏡 Updating homepage for user #${user_id}`)

	const abslackt = getAbslackt({ access_token })
	const blocks = await getPlayBlocks({ access_token, user_id })
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
