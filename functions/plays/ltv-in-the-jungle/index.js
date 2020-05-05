const cast = [
	{
		username: 'nn',
		fullname: 'Natalie Narrator',
	},
	{
		username: 'ee',
		fullname: 'Ellie Elephant',
	},
	{
		username: 'tt',
		fullname: 'Tyrone Tortoise',
	},
	{
		username: 'vv',
		fullname: 'Vicky Vole',
	},
]

const transcript = new Map([
	{
		type: 'message',
		from: 'nn',
		text: 'Welcome. You find yourself starting work for Friendly Team ™, or FT for short. You’re exclusively in charge of managing a portfolio of clients, who pay a subscription to access our content online.',
	},
	{
		type: 'message',
		from: 'nn',
		text: 'Your day begins with a startling missive from your boss, Ellie Elephant ...',
	},
	{
		type: 'message',
		from: 'ee',
		text: '[name], if I’ve told you once I’ve told you a thousand times. An elephant never forgets and I distinctly remember telling you.',
	},
	{
		type: 'message',
		from: 'ee',
		text: 'I’m going to check in on you later on. You’d better have a plan to increase average LTV of your portfolio. This is your last warning. If I’m not satisfied with your progress it will go on your Permanent Record. ',
	},
	{
		type: 'message',
		from: 'nn',
		text: 'After reading this you feel your blood pressure rising and sweat starts to moisten your brow. You’ve never heard of LTV. What could it possibly mean? ',
	},
	{
		type: 'choice',
		options: [
			{
				correct: false,
				label: 'Limited Term Variable',
				response: {
					from: 'nn',
					text: 'No, that can’t be right.',
				},
			},
			{
				correct: false,
				label: 'Large Table Viscosity',
				response: {
					from: 'nn',
					text: 'No. What would that even mean?.',
				},
			},
			{
				correct: false,
				label: 'Lifetime Value',
				response: {
					from: 'nn',
					text: 'Ah yes, of course.',
				},
			},
		],
	},
	{
		type: 'message',
		from: 'nn',
		text: 'But why would Ellie want you to make a plan to increase LTV? And how would you even start? What changes can you make? You reach for bottle of vodka under your desk ...',
	},
	{
		type: 'message',
		from: 'nn',
		text: 'Suddenly you remember that your colleague, Vicky Vole, is usually first to figure out this kind of thing. So you send them a message asking for help.',
	},
	{
		type: 'message',
		from: 'player',
		text: 'Hey @vicky.vole. What’s up with LTV?',
	},
	{
		type: 'message',
		from: 'vv',
		text: 'New phone. Who dis?',
	},
	{
		type: 'message',
		from: 'player',
		text: 'LOL PLZ HLP',
	},
	{
		type: 'message',
		from: 'player',
		text: 'I need to do a plan for LTV. ',
	},
])

const view = {
	type: 'modal',
	title: {
		type: 'plain_text',
		text: 'LTV in the Jungle',
		emoji: true,
	},
	submit: {
		type: 'plain_text',
		text: 'Continue',
		emoji: true,
	},
	close: {
		type: 'plain_text',
		text: 'Close',
		emoji: true,
	},
	blocks: [
		{
			type: 'context',
			elements: [
				{
					type: 'mrkdwn',
					text: `*It's early morning. You find yourself at your normal job, working for Friendly Team™.* \n\nYou’re in charge of managing a portfolio of clients who pay subscription fees to access FT content.`,
				},
			],
		},
	],
}

module.exports = {
	cast,
	transcript,
	view,
}
