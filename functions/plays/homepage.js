const view = {
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
					text: '*Top Plays*\n<fakelink.toUrl.com|LTV in the Jungle>\n<fakelink.toUrl.com|Journalist or Pugalist?>\n<fakelink.toUrl.com|Match the Headline>',
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
		{
			type: 'divider',
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: '*LTV in the Jungle* :star: :star: :star: :star:',
			},
		},
		{
			type: 'context',
			elements: [
				{
					type: 'image',
					image_url: 'https://api.slack.com/img/blocks/bkb_template_images/profile_2.png',
					alt_text: 'Angela Sjoholm',
				},
				{
					type: 'mrkdwn',
					text: '*Angela Sjoholm*',
				},
			],
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: 'A fast-paced action adventure pitting you against the wild.',
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
					value: 'ltv-in-the-jungle',
				},
				{
					type: 'button',
					text: {
						type: 'plain_text',
						text: 'View Details',
						emoji: true,
					},
					value: 'ltv-in-the-jungle-details',
				},
			],
		},
		{
			type: 'divider',
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: '*Journalist or Pugalist?* :star: :star: :star:',
			},
		},
		{
			type: 'context',
			elements: [
				{
					type: 'image',
					image_url: 'https://api.slack.com/img/blocks/bkb_template_images/profile_3.png',
					alt_text: 'Kiya Gurmesa',
				},
				{
					type: 'mrkdwn',
					text: '*Kiya Gurmesa*',
				},
			],
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `Writer or fighter — can you tell who's who?`,
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
					value: 'journalist-or-pugalist',
				},
				{
					type: 'button',
					text: {
						type: 'plain_text',
						text: 'View Details',
						emoji: true,
					},
					value: 'journalist-or-pugalist-details',
				},
			],
		},
	],
}

module.exports = {
	view,
}
