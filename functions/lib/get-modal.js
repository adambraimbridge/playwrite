const getModal = async ({ abslackt, trigger_id }) => {
	const { view } = await abslackt
		.spawnModal({
			trigger_id,
			view: {
				callback_id: 'playwrite',
				type: 'modal',
				title: {
					type: 'plain_text',
					text: 'Playwrite',
					emoji: true,
				},
				blocks: [
					{
						type: 'image',
						image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Loading-red-spot.gif',
						alt_text: 'Loading ... [Attribution: Baharboloor25 / CC BY-SA (https://creativecommons.org/licenses/by-sa/4.0)]',
					},
				],
			},
		})
		.catch(console.error)
	return view
}

module.exports = {
	getModal,
}
