const plays = [
	{
		id: 'ltv-in-the-jungle',
		title: 'LTV in the Jungle',
		author: {
			name: 'Angela Sjoholm',
			image_url: 'https://api.slack.com/img/blocks/bkb_template_images/profile_2.png',
		},
		description: 'A fast-paced action adventure pitting you against the wild.',
		score: ':star: :star: :star: :star:',
	},
	{
		id: 'journalist-or-pugilist',
		title: 'Journalist or Pugilist?',
		author: {
			name: 'Kiya Gurmesa',
			image_url: 'https://api.slack.com/img/blocks/bkb_template_images/profile_3.png',
		},
		description: `Writer or fighter — can you tell who's who?`,
		score: ':star: :star: :star:',
	},
]

const playBlocks = plays.reduce((accumulator, { id, title, author, description, score }) => {
	return accumulator.concat([
		{
			type: 'divider',
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `*${title}* ${score}`,
			},
		},
		{
			type: 'context',
			elements: [
				{
					type: 'image',
					image_url: author.image_url,
					alt_text: author.name,
				},
				{
					type: 'mrkdwn',
					text: `*${author.name}*`,
				},
			],
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: description,
			},
		},
		{
			type: 'actions',
			elements: [
				{
					type: 'button',
					text: {
						type: 'plain_text',
						text: 'Play',
						emoji: true,
					},
					style: 'primary',
					value: id,
				},
				{
					type: 'button',
					text: {
						type: 'plain_text',
						text: 'View Details',
						emoji: true,
					},
					value: `${id}-details`,
				},
			],
		},
	])
}, [])

const homepage = {
	blocks: [
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
	].concat(playBlocks),
}

module.exports = {
	homepage,
}
