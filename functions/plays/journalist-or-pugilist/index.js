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

// Act one ends with a choice from the narrator
const actOne = [
	{
		type: 'message',
		from: 'nn',
		text: `Welcome. You find yourself starting work for Friendly Team ™, or FT for short. You’re exclusively in charge of managing a portfolio of clients, who pay a subscription to access our content online.`,
	},
	{
		type: 'message',
		from: 'nn',
		text: `Your day begins with a startling missive from your boss, Ellie Elephant ...`,
	},
	{
		type: 'message',
		from: 'ee',
		text: `[name], if I’ve told you once I’ve told you a thousand times. An elephant never forgets and I distinctly remember telling you.`,
	},
	{
		type: 'message',
		from: 'ee',
		text: `I’m going to check in on you later on. You’d better have a plan to increase average LTV of your portfolio. This is your last warning. If I’m not satisfied with your progress it will go on your Permanent Record. `,
	},
	{
		type: 'message',
		from: 'nn',
		text: `After reading this you feel your blood pressure rising and sweat starts to moisten your brow. You’ve never heard of LTV. What could it possibly mean? `,
	},
	{
		type: 'choice',
		options: [
			{
				correct: false,
				label: 'Limited Term Variable',
				response: {
					from: 'nn',
					text: `No, that can’t be right. Try again.`,
				},
			},
			{
				correct: false,
				label: 'Large Table Viscosity',
				response: {
					from: 'nn',
					text: `No. That's not even a thing.`,
				},
			},
			{
				correct: true,
				label: 'Lifetime Value',
				response: {
					from: 'nn',
					text: `Ah yes, of course. Well done.`,
				},
			},
		],
	},
]

// Act two ends in a choice from Vicky Vole
const actTwo = [
	{
		type: 'message',
		from: 'nn',
		text: `But why would Ellie want you to make a plan to increase LTV? And how would you even start? What changes can you make? You reach for bottle of vodka under your desk ...`,
	},
	{
		type: 'message',
		from: 'nn',
		text: `Suddenly you remember that your colleague, Vicky Vole, is usually first to figure out this kind of thing. So you send them a message asking for help.`,
	},
	{
		type: 'message',
		from: 'player',
		text: `Hey @vicky.vole. What’s up with LTV?`,
	},
	{
		type: 'message',
		from: 'vv',
		text: `New phone. Who dis?`,
	},
	{
		type: 'message',
		from: 'player',
		text: `:grin: LOL PLZ HLP`,
	},
	{
		type: 'message',
		from: 'player',
		text: `I need to do a plan for LTV. `,
	},
	{
		type: 'message',
		from: 'nn',
		text: `To be continued ...`,
	},
]

// Act three ends in a choice from Tyrone Tortoise
const actThree = [
	{
		type: 'message',
		from: 'nn',
		text: `Something something act three`,
	},
]

// Act four ends with submitting a LTV plan to Ellie E
const actFour = [
	{
		type: 'message',
		from: 'nn',
		text: `Something something act four`,
	},
]

const finale = {}
// Either the narrator tells you how you went,
// or there's some other way to let you know the effect of your LTV choices

// Todo: Show progress to the player
const transcript = [].concat(
	actOne, //
	actTwo,
	actThree,
	actFour,
	finale
)

const play = {
	id: 'journalist-or-pugilist',
	title: 'Journalist or Pugilist?',
	author: {
		name: 'Kiya Gurmesa',
		image_url: 'https://api.slack.com/img/blocks/bkb_template_images/profile_3.png',
	},
	description: `Writer or fighter — can you tell who's who?`,
	score: ':star: :star: :star:',
	transcript,
}

module.exports = play
