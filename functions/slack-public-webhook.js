// abslackt === "[A]dam + [B]raimbridge + "[Slack] + abstrac[t]"
const abslackt = require('./lib/@adambraimbridge/abslackt')

const setupSlackWebhooks = (slack) => {
	slack.on('error', () => {
		console.log(`Slack error 01: ${error.message}`)
	})

	slack.on('app_home_opened', async () => {
		const { user, tab } = slack.payload.event
		const view = {
			type: tab,
			blocks: [
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: "Hello, Assistant to the Regional Manager Dwight! *Michael Scott* wants to know where you'd like to take the Paper Company investors to dinner tonight.\n\n *Please select a restaurant:*",
					},
				},
				{
					type: 'divider',
				},
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: '*Farmhouse Thai Cuisine*\n:star::star::star::star: 1528 reviews\n They do have some vegan options, like the roti and curry, plus they have a ton of salad stuff and noodles can be ordered without meat!! They have something for everyone here',
					},
					accessory: {
						type: 'image',
						image_url: 'https://s3-media3.fl.yelpcdn.com/bphoto/c7ed05m9lC2EmA3Aruue7A/o.jpg',
						alt_text: 'alt text for image',
					},
				},
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: '*Kin Khao*\n:star::star::star::star: 1638 reviews\n The sticky rice also goes wonderfully with the caramelized pork belly, which is absolutely melt-in-your-mouth and so soft.',
					},
					accessory: {
						type: 'image',
						image_url: 'https://s3-media2.fl.yelpcdn.com/bphoto/korel-1YjNtFtJlMTaC26A/o.jpg',
						alt_text: 'alt text for image',
					},
				},
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: '*Ler Ros*\n:star::star::star::star: 2082 reviews\n I would really recommend the  Yum Koh Moo Yang - Spicy lime dressing and roasted quick marinated pork shoulder, basil leaves, chili & rice powder.',
					},
					accessory: {
						type: 'image',
						image_url: 'https://s3-media2.fl.yelpcdn.com/bphoto/DawwNigKJ2ckPeDeDM7jAg/o.jpg',
						alt_text: 'alt text for image',
					},
				},
				{
					type: 'divider',
				},
				{
					type: 'actions',
					elements: [
						{
							type: 'button',
							text: {
								type: 'plain_text',
								text: 'Farmhouse',
								emoji: true,
							},
							value: 'click_me_123',
						},
						{
							type: 'button',
							text: {
								type: 'plain_text',
								text: 'Kin Khao',
								emoji: true,
							},
							value: 'click_me_123',
						},
						{
							type: 'button',
							text: {
								type: 'plain_text',
								text: 'Ler Ros',
								emoji: true,
							},
							value: 'click_me_123',
						},
					],
				},
			],
		}
		const response = await slack.publish({ user_id: user, view })
		return response
	})
}

/**
 * Slack Public Webhook
 *
 * This function is called from Slack.
 * @see https://github.com/slackapi/node-slack-sdk
 * @see https://slack.dev/node-slack-sdk/web-api
 */
exports.handler = (request) => {
	// Always respond with a 200 (OK) response, to let Slack know their post was received.
	const response = {
		statusCode: 200,
		body: 'ok',
	}

	try {
		// Handle Slack challenges. See: https://api.slack.com/events/url_verification
		const slack = abslackt(request)
		const { type, challenge } = slack.payload
		if (!!challenge && !!type && type === 'url_verification') {
			response.body = challenge
		} else {
			/**
			 * Do not await a response, because otherwise it will time out,
			 * and Slack keeps resending the event.
			 */
			setupSlackWebhooks(slack)
			slack.run()
		}
	} catch (error) {
		console.error(error)
	}
	return response
}
