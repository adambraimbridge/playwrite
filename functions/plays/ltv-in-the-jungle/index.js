// Act one ends with a choice from the narrator
// Act two ends in a choice from Vicky Vole
// Act three ends in a choice from Tyrone Tortoise
// Act four ends with submitting a LTV plan to Ellie Elephant
// Either the narrator tells you how you went,
// or there's some other way to let you know the effect of your LTV choices

const cast = {
	'natalie-narrator': {
		name: 'Natalie Narrator',
	},
	'ellie-elephant': {
		name: 'Ellie Elephant',
	},
	'tyrone-tortoise': {
		name: 'Tyrone Tortoise',
	},
	'vicky-vole': {
		name: 'Vicky Vole',
	},
}

/**
 * Message = Direct message
 * Modal = Modal popup
 */
const transcript = [
	{
		type: 'modal',
		from: 'natalie-narrator',
		text: `The curtain raises.

You find yourself starting yet another day of work.`,
	},
	{
		type: 'modal',
		from: 'natalie-narrator',
		text: `You've recently been placed in charge of managing a portfolio of clients who pay a subscription to access online content.`,
	},
	{
		type: 'modal',
		from: 'natalie-narrator',
		text: `Your day begins with a startling missive from your boss, Ellie Elephant ...`,
	},
	{
		type: 'message',
		from: 'ellie-elephant',
		to: 'player',
		text: `You're in trouble now {{player.name}}!`,
	},
	{
		type: 'message',
		from: 'ellie-elephant',
		to: 'player',
		text: `If I’ve told you once I’ve told you a thousand times. An elephant never forgets and I distinctly remember telling you.`,
	},
	{
		type: 'message',
		from: 'ellie-elephant',
		to: 'player',
		text: `This is your last warning. If I’m not satisfied with your progress it will go on your _Permanent Record._`,
	},
	{
		type: 'message',
		from: 'ellie-elephant',
		to: 'player',
		text: `I’m going to check in on you later on.`,
	},
	{
		type: 'message',
		from: 'ellie-elephant',
		to: 'player',
		text: `When I do, you’d better have a plan to increase average LTV of your portfolio.`,
	},
	{
		type: 'modal',
		from: 'natalie-narrator',
		text: `After reading this you feel your blood pressure rising and sweat starts to moisten your brow. You’ve never heard of LTV. What could it possibly mean? `,
		options: [
			{
				correct: false,
				label: 'Limited Term Variable',
				response: {
					from: 'natalie-narrator',
					to: '',
					text: `No, that can’t be right. Try again.`,
				},
			},
			{
				correct: false,
				label: 'Large Table Viscosity',
				response: {
					from: 'natalie-narrator',
					to: '',
					text: `No. That's not even a thing.`,
				},
			},
			{
				correct: true,
				label: 'Lifetime Value',
				response: {
					from: 'natalie-narrator',
					to: '',
					text: `Ah yes, of course. Well done.`,
				},
			},
		],
	},
	{
		type: 'modal',
		from: 'natalie-narrator',
		text: `But why would Ellie want you to make a plan to increase LTV? And how would you even start? What changes can you make?`,
	},
	{
		type: 'modal',
		from: 'natalie-narrator',
		text: `You feel your resolve weaken as you reach for the bottle of vodka under your desk ... And impusively snatch your hand back — still empty. No. Not again. Never again. There has to be another way.`,
	},
	{
		type: 'modal',
		from: 'natalie-narrator',
		text: `Suddenly you remember! Your colleague, Vicky Vole, is always first to figure out this kind of thing. So you send them a message asking for help.`,
	},
	{
		type: 'message',
		from: 'player',
		to: 'vicky-vole',
		text: `Hey @vicky.vole. What’s up with LTV?`,
	},
	{
		type: 'message',
		from: 'vicky-vole',
		to: 'player',
		text: `New phone. Who dis?`,
	},
	{
		type: 'message',
		from: 'player',
		to: 'vicky-vole',
		text: `:grin: LOL PLZ HLP`,
	},
	{
		type: 'message',
		from: 'player',
		to: 'vicky-vole',
		text: `I need to do a plan for LTV. `,
	},
	{
		type: 'modal',
		from: 'natalie-narrator',
		text: `To be continued ...`,
	},
]

const play = {
	id: 'ltv-in-the-jungle',
	title: 'LTV in the Jungle',
	author: {
		name: 'Angela Sjoholm',
		image_url: 'https://api.slack.com/img/blocks/bkb_template_images/profile_2.png',
	},
	description: 'A fast-paced action adventure pitting you against the wild.',
	score: ':star: :star: :star: :star:',
	transcript,
	cast,
}

module.exports = play
