const axios = require('axios')
const { getAbslackt } = require('./lib/abslackt')
const { NETLIFY_DEV, PLAYWRITE_API_KEY } = process.env
const SITE_HOST = NETLIFY_DEV === 'true' ? 'https://playwrite.ngrok.io' : 'https://playwrite.netlify.app'

const sendMessage = async ({ access_token, conversation, cast, message, playId, currentLineNumber }) => {
	const messageStub = {
		channel: conversation.id,
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
		conversation,
		cast,
		message,
		playId,
		playNextMessage,
	} = bodyPayload

	console.debug(`🦄 Sending message. Line #${currentLineNumber}.`)
	await sendMessage({
		access_token, //
		conversation,
		cast,
		message,
		playId,
		currentLineNumber,
	})

	// Automatically pause when given options to choose from.
	// This allows the user to interact.
	if (message.options) {
		console.debug(`🦄 Pausing to let the user select an option ...`)
	} else if (!!playNextMessage) {
		const payload = {
			type: 'cue_next_message', //
			access_token,
			conversation,
			cast,
			playId,
			currentLineNumber,
		}

		console.debug(`🦄 Calling the Director to cue the next line ...`)
		axios.post(`${SITE_HOST}/.netlify/functions/director`, payload, {
			headers: {
				'x-playwrite-api-key': process.env.PLAYWRITE_API_KEY,
			},
		})
	}

	return {
		statusCode: 200,
		body: '',
	}
}
