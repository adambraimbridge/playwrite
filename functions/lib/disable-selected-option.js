const disableSelectedOption = ({ abslackt, payload }) => {
	console.debug(`🐼 Updating message to disable the selected option`)
	const {
		text: actionText,
		action_id: actionStateId, //
		block_id: selectedBlockId,
	} = payload.actions[0]

	const { blocks } = payload.message
	const newBlocks = blocks.reduce((accumulator, block) => {
		if (block.block_id === selectedBlockId) {
			// Remove the button that was clicked. There's no way to have a "disabled" button in a Slack message.
			const newElements = block.elements.filter(({ action_id }) => action_id !== actionStateId)
			if (newElements.length) {
				accumulator.push(Object.assign({}, block, { elements: newElements }))
			}
		} else {
			accumulator.push(block)
		}
		return accumulator
	}, [])

	// Put back the previously selected action, but as text rather than as a button
	newBlocks.push({
		type: 'context',
		elements: [
			{
				type: 'mrkdwn',
				text: actionText.text,
			},
		],
	})

	// https://api.slack.com/methods/chat.update
	const { channel_id: channel, message_ts: ts } = payload.container
	abslackt.updateMessage({ channel, ts, blocks: newBlocks }).catch(console.error)
}

module.exports = {
	disableSelectedOption,
}
