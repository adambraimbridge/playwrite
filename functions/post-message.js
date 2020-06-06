const axios = require('axios')
const { getAbslackt } = require('./lib/abslackt')
const { NETLIFY_DEV, PLAYWRITE_API_KEY } = process.env
const SITE_HOST = NETLIFY_DEV === 'true' ? 'https://playwrite.ngrok.io' : 'https://playwrite.netlify.app'

const delay = (milliseconds) => {
	return new Promise((resolve) => setTimeout(() => resolve(), milliseconds))
}

const sendMessage = async ({ access_token, conversationId, cast, message, playId, currentLineNumber }) => {
	const messageStub = {
		channel: conversationId,
		link_names: true,
	}

	if (!message || !message.from) {
		return
	}
	const { real_name, icon_emoji } = cast[message.from]

	const view = Object.assign({}, messageStub, {
		icon_emoji,
		username: real_name,
	})

	const { text } = message
	view.blocks = [
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text,
			},
		},
	]

	// Image block
	const { image_url, alt_text } = message
	if (image_url) {
		view.blocks.unshift({
			type: 'image',
			image_url,
			alt_text,
		})
	}

	const { options } = message
	if (options) {
		const elements = options.map((option, index) => {
			const { text } = option
			const value = JSON.stringify({
				conversationId,
				currentLineNumber,
				optionNumber: index,
			})
			return {
				type: 'button',
				value,
				action_id: `option-${index}`,
				text: {
					type: 'plain_text',
					emoji: true,
					text,
				},
			}
		})

		view.blocks.push({
			type: 'actions',
			block_id: playId,
			elements,
		})
	}

	const abslackt = getAbslackt({ access_token })
	await abslackt
		.postMessage({ view }) //
		.catch(console.error)
}

exports.handler = async (request) => {
	if (!request.headers['x-playwrite-api-key'] || request.headers['x-playwrite-api-key'] !== PLAYWRITE_API_KEY) {
		console.warn('🤔 Incorrect or missing x-playwrite-api-key')
		return {
			statusCode: 500,
			body: '🤔 Incorrect or missing key',
		}
	}

	const bodyPayload = JSON.parse(request.body)
	const {
		access_token, //
		currentLineNumber,
		conversationId,
		cast,
		message,
		playId,
		playNextMessage,
	} = bodyPayload

	// Delay slightly between posting messages (to simulate the real-life instant-messaging experience)
	// const milliseconds = 500 + message.text.length * 5
	const milliseconds = 1000
	console.debug(`🍕 Delaying ${milliseconds} milliseconds before sending message ...`)
	await delay(milliseconds)

	console.debug(`🍕 Sending message. Line #${currentLineNumber}.`)
	sendMessage({
		access_token, //
		conversationId,
		cast,
		message,
		playId,
		currentLineNumber,
	}).catch(console.error)

	// Automatically pause when given options to choose from.
	// This allows the user to interact.
	if (message.options) {
		console.debug(`🍕 Pausing to let the user select an option ...`)
	} else if (!!playNextMessage) {
		const payload = {
			type: 'cue_next_message', //
			access_token,
			conversationId,
			cast,
			playId,
			currentLineNumber,
		}

		console.debug(`🍕 Calling ${SITE_HOST}/.netlify/functions/director to cue line #${currentLineNumber + 1}`)
		axios
			.post(`${SITE_HOST}/.netlify/functions/director`, payload, {
				headers: {
					'x-playwrite-api-key': process.env.PLAYWRITE_API_KEY,
				},
			})
			.catch(console.error)
	}

	return {
		statusCode: 200,
		body: '',
	}
}
