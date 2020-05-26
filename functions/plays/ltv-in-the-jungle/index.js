// Act one ends with a choice from the narrator
// Act two ends in a choice from Vicky Vole
// Act three ends in a choice from Tyrone Tortoise
// Act four ends with submitting a LTV plan to Ellie Elephant
// Either the narrator tells you how you went,
// or there's some other way to let you know the effect of your LTV choices

// Author comes from Slack User ID https://[slack-organisation].slack.com/account/profile
const play = {
	author: 'U012B5GLCJG',
	id: 'ltv-in-the-jungle',
	title: 'LTV in the Jungle',
	description: 'A fast-paced action adventure pitting you against the wild.',
	score: ':star: :star: :star: :star:',
	duration: 'Less than five minutes',
}

play.cast = {
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
play.getTranscript = ({ player }) => [
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
		alt_text: `This season, the part of Ellie Elephant is played by Suzie (https://commons.wikimedia.org/wiki/Category:Suzy_(elephant))`,
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
				continue: false,
				text: 'Limited Term Variable',
				response: {
					type: 'message',
					from: 'natalie-narrator',
					text: `❌ \`Limited Term Variable\` No. That's not even a thing.`,
				},
			},
			{
				continue: true,
				text: 'Lifetime Value',
				response: {
					type: 'message',
					from: 'natalie-narrator',
					text: `✅ \`Lifetime Value\` Ah yes, of course. Well done.`,
				},
			},
			{
				continue: false,
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
		text: `Your colleague, Vicky Vole, is always first to figure out this kind of thing.`,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `So you send them a message asking for help.`,
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
		text: `I need to do a plan for LTV.`,
	},
	{
		type: 'message',
		from: 'player',
		text: `I know LTV means lifetime value`,
	},
	{
		type: 'message',
		from: 'player',
		text: `But TBH I don't have any idea how it works. Do you know?`,
	},
	{
		type: 'message',
		from: 'vicky-vole',
		text: `Ah, yeah. Cool. Did you get the Product & Tech email from the other day?`,
	},
	{
		type: 'message',
		from: 'player',
		text: `Um, I must have missed it ..?`,
	},
	{
		type: 'message',
		from: 'vicky-vole',
		text: `You _never_ check your emails :angry: `,
	},
	{
		type: 'message',
		from: 'vicky-vole',
		text: `Anyway it has a link to a video called "What you need to know about LTV at the FT" `,
	},
	{
		type: 'message',
		from: 'vicky-vole',
		text: `One sec ...`,
	},
	{
		type: 'message',
		from: 'tyrone-tortoise',
		text: `:wave: Hello`,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `Ugh. You hate it when people just message one word. Get to the point! `,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `So annoying.`,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `You decide to ignore Tyrone.`,
	},
	{
		type: 'message',
		from: 'vicky-vole',
		text: `Here: https://drive.google.com/file/d/1mnggrvAz7-PU7nwko73RlJNclDlWmCas/view`,
		interactionCue: true,
		options: [
			{
				continue: false,
				text: `Thanks. I'll watch it later`,
				response: {
					type: 'message',
					from: 'vicky-vole',
					text: `❌ \`Watch later\` It's not very long. You'll be better off if you watch it right now.`,
				},
			},
			{
				continue: false,
				text: `Oh yeah, I've already watched that one.`,
				response: {
					type: 'message',
					from: 'vicky-vole',
					text: `❌ \`Already watched\` Trust me, it makes more sense when you watch it again. It's only 2 mins ...`,
				},
			},
			{
				continue: true,
				text: `Awesoem, thanks Vicky.`,
				response: {
					type: 'message',
					from: 'vicky-vole',
					text: `✅ \`Awesoem\` No problem. we're here for a good time, not a long time :hugging_face:`,
				},
			},
		],
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `After watching the video you see that you can get more information at https://www.ft.com/lifetimevalue.`,
	},
	{
		type: 'message',
		from: 'player',
		text: `_Hm, looks like I can get more information at https://www.ft.com/lifetimevalue. I should have a look through it and bookmark it for future reference._ `,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `The clock inexorably winds its way onwards. You still have to make an LTV plan for Ellie. `,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `What to do ... what to do ...  `,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `... Let's see what Tyrone wanted.`,
	},
	{
		type: 'message',
		from: 'player',
		text: `Hi @tyrone. What's up?`,
	},
	{
		type: 'message',
		from: 'tyrone-tortoise',
		text: `I heard you're our resident expert in LTV. Can I see the plan you've made?`,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `LOL sucks to be you :joy_cat: `,
	},
	{
		type: 'message',
		from: 'player',
		text: `Well I'm certainly no expert, but I am working on an LTV plan, yeah.`,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `Off the top of your head, there's two options: `,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `Cancel all discounts and spend the extra budget on marketing for new clients. More clients mean more profit.`,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `Or: Increase all client discounts by 20%. It'll make them happy and reduce the amount of cancellations, so we won't lose that money. `,
	},
	{
		type: 'message',
		from: 'player',
		text: `Here's what I'm thinking of starting with:`,
		interactionCue: true,
		options: [
			{
				continue: true,
				text: `Cancel all client discounts`,
				response: {
					type: 'message',
					from: 'tyrone-tortoise',
					text: `But what about the clients who will cancel their accounts because for them it's too expensive?`,
				},
			},
			{
				continue: true,
				text: `Increase discounts by 20%`,
				response: {
					type: 'message',
					from: 'tyrone-tortoise',
					text: `But if we charge less, we'll need to make up that loss in profit somehow, won't we?`,
				},
			},
		],
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `Of course, it's never as simple as you think. What works for some won't work for others.`,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `If only there was some kind of LTV Simulator you could use to help fine-tune the decisions you need to make for each client.`,
	},
	{
		type: 'message',
		from: 'player',
		text: `Tyrone, you're asking questions outside your pay grade. `,
	},
	{
		type: 'message',
		from: 'player',
		text: `I'm going to figure it out. Leave it with me and I'll get back to you`,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `Edit: You never got back to Tyrone ever again.`,
	},
	{
		type: 'message',
		from: 'tyrone-tortoise',
		text: `Thanks! Oh BTW there's a cool LTV simulator that you could use to help fine-tune the decisions you need to make for each client.`,
	},
	{
		type: 'message',
		from: 'tyrone-tortoise',
		text: `It's in the https://www.ft.com/lifetimevalue site. KTHXBAI,`,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: ` ... `,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `Well that's a stunning coincidence.`,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `Come back here after you've had a look at that LTV simulator.`,
		interactionCue: true,
		options: [
			{
				continue: true,
				text: `Okay I'm back.`,
				response: {
					type: 'message',
					from: 'natalie-narrator',
					text: `Just in time! Ellie has run out of patience. She is absolutely _furious!_`,
				},
			},
		],
	},
	{
		type: 'message',
		from: 'ellie-elephant',
		text: `Hi ${player.name}! I hope you're doing well. Just chasing up on that LTV plan. No rush, but how's it going?`,
	},
	{
		type: 'message',
		from: 'player',
		text: `Hi @natalie-narrator, Adam here.`,
		interactionCue: true,
		options: [
			{
				continue: false,
				text: `This is where I get stuck.`,
				response: {
					type: 'message',
					from: 'natalie-narrator',
					text: `Oh? Why's that?`,
				},
			},
			{
				continue: false,
				text: `Because I don't understand LTV :( `,
				response: {
					type: 'message',
					from: 'natalie-narrator',
					text: `I can see how that might make it difficult for you to teach _others_ how to undertand LTV.`,
				},
			},
			{
				continue: true,
				text: `I need help for this part`,
				response: {
					type: 'message',
					from: 'natalie-narrator',
					text: `Okay, Here's what you do: Demo this to the analytics team and if they like it, they'll know what to do.`,
				},
			},
		],
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		image_url: 'https://media.giphy.com/media/KINAUcarXNxWE/200w_d.gif',
		alt_text: ` ~ fin. ~`,
		text: `*GAME OVER*`,
	},
	{
		type: 'message',
		from: 'player',
		text: `

		TO DO:

		The player has to pick some kind of LTV plan.

		Once they do, they'll get a summary of what they just learned.

		Maybe they'll get a score, or some gold stars.

		In version 1.1, there'll be a feedback prompt with :thumbsup: :thumbsdown:  or similar.

		Next up, we can make more little games to explore how LTV relates to 'Attribution' and 'Sensitivity'.
		`,
	},
	{
		type: 'message',
		from: 'natalie-narrator',
		text: `To be continued ...`,
	},
]

module.exports = play
