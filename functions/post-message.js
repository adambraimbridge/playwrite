const { getAbslackt } = require('./lib/abslackt')
const { PLAYWRITE_API_KEY } = process.env

const sendMessage = async ({ access_token, conversation, cast, message }) => {
	const messageStub = {
		channel: conversation.id,
		link_names: true,
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
				lineNumber,
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

	const payload = JSON.parse(request.body)
	const {
		access_token,
		currentLineNumber,
		conversation,
		cast,
		message,
		playId, //
		playNextLine,
	} = payload

	console.debug(`🦄 Sending message. Line #${currentLineNumber}.`)
	await sendMessage({ access_token, conversation, cast, message, playId })

	if (!!playNextLine) {
		// @todo
		console.debug(`🦄 Calling the Director to cue the next line ...`)
	}

	return {
		statusCode: 200,
		body: '',
	}
}
