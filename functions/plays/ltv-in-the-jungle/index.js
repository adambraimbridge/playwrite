// Act one ends with a choice from the narrator
// Act two ends in a choice from Vicky Vole
// Act three ends in a choice from Tyrone Tortoise
// Act four ends with submitting a LTV plan to Ellie Elephant
// Either the narrator tells you how you went,
// or there's some other way to let you know the effect of your LTV choices

const cast = {
	'natalie-narrator': {
		real_name: 'Natalie Narrator',
		icon_emoji: ':scroll:',
	},
	'ellie-elephant': {
		real_name: 'Ellie Elephant',
		icon_emoji: ':elephant:',
	},
	'tyrone-tortoise': {
		real_name: 'Tyrone Tortoise',
		icon_emoji: ':turtle:',
	},
	'vicky-vole': {
		real_name: 'Vicky Vole',
		icon_emoji: ':mouse:',
	},
}

/**
 * Message = Direct message
 * Modal = Modal popup
 */
const getTranscript = ({ player }) => [
	{
		type: 'modal',
		from: 'natalie-narrator',
		image_url: 'http://placekitten.com/700/500',
		alt_text: 'In this drama you play the part of a kitten.',
		text: `The curtain rises.

You find yourself starting yet another day of work.`,
	},
	{
		type: 'modal',
		from: 'natalie-narrator',
		image_url: 'http://placekitten.com/700/500',
		alt_text: `Your character's primary motivation is: Kitten.`,
		text: `You've recently been placed in charge of managing a portfolio of clients who pay a subscription to access online content.`,
	},
	{
		type: 'modal',
		from: 'natalie-narrator',
		image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/20100605_Harry_Malter_%280062%29.jpg/800px-20100605_Harry_Malter_%280062%29.jpg',
		alt_text: `This season the part of Ellie Elephant is played by Suzie (https://commons.wikimedia.org/wiki/Category:Suzy_(elephant))`,
		text: `Your day begins with a startling missive from your boss, Ellie Elephant ...`,
	},
	{
		type: 'message',
		from: 'ellie-elephant',
		text: `You're in trouble now @${player.name}!`,
	},
	{
		type: 'message',
		from: 'ellie-elephant',
		text: `If I’ve told you once I’ve told you a thousand times. An elephant never forgets and I distinctly remember telling you.`,
	},
	{
		type: 'message',
		from: 'ellie-elephant',
		text: `This is your last warning. If I’m not satisfied with your progress it will go on your _Permanent Record._`,
	},
	{
		type: 'message',
		from: 'ellie-elephant',
		text: `I’m going to check in on you later on.`,
	},
	{
		type: 'message',
		from: 'ellie-elephant',
		text: `When I do, you’d better have a plan to increase average LTV of your portfolio.`,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `After reading this you feel your blood pressure rising and sweat starts to moisten your brow. You’ve never heard of LTV. What could it possibly mean? `,
		interactionCue: true,
		options: [
			{
				correct: false,
				text: 'Limited Term Variable',
				response: {
					type: 'message',
					from: 'natalie-narrator',
					text: `❌ \`Limited Term Variable\` No. That's not even a thing.`,
				},
			},
			{
				correct: true,
				text: 'Lifetime Value',
				response: {
					type: 'message',
					from: 'natalie-narrator',
					text: `✅ \`Lifetime Value\` Ah yes, of course. Well done.`,
				},
			},
			{
				correct: false,
				text: 'Least Terrible Version',
				response: {
					type: 'message',
					from: 'natalie-narrator',
					text: `🤔 \`Least Terrible Version\` No, that can’t be right. Try again.`,
				},
			},
		],
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `But why would Ellie want you to make a plan to increase LTV? And how would you even start? What changes can you make?`,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `Anxiety grows and you feel your resolve weaken as you reach for the bottle of vodka under your desk ...`,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `Suddenly you snatch back your empty hand. "No", you think. Not again. _Never again._`,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `And then you remember! Of course, that's it!`,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `Your colleague, Vicky Vole, is always first to figure out this kind of thing.

So you send them a message asking for help.`,
	},
	{
		type: 'message',
		from: 'player',
		text: `Hey @vicky.vole. What’s up with LTV?`,
	},
	{
		type: 'message',
		from: 'vicky-vole',
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
		from: 'natalie-narrator',
		text: `To be continued ...`,
	},
]

// Author comes from Slack User ID https://[slack-organisation].slack.com/account/profile
const play = {
	author: 'U012B5GLCJG',
	id: 'ltv-in-the-jungle',
	title: 'LTV in the Jungle',
	description: 'A fast-paced action adventure pitting you against the wild.',
	score: ':star: :star: :star: :star:',
	duration: 'Less than five minutes',
	getTranscript,
	cast,
}

module.exports = play
