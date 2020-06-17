const getRandomTagline = () => {
	const taglines = [
		`Because you're worth it.`, //
		`Learning doesn't have to be boring.`,
		`Hey. You're awesome. I don't say that often enough. But you are.`,
		`Stay tuned for further updates.`,
		`:birthday: Happy birthday!`,
		`The best experience for corporate games synergy engagement.`,
		`I can't believe I get paid to do this.`,
		`Fun fact: You can make your own Playwrite games.`,
		`Doctors hate these 10 reasons why you can't believe how easy this works!`,
		`What do we want!? _*Time travel!*_ When do we want it!? _*That's irrelevant!*_`,
		`You are now aware that your tongue is touching the roof of your mouth.`,
		`Memo: Remember to attach cover sheets to your TPS reports.`,
		`No matter how much you push the envelope, it'll always be stationery.`,
		`Today's fortune: People love and respect you.`,
		`Colorless green ideas sleep furiously.`,
		`This is fine.`,
		`
If you want to view paradise
Simply look around and view it
Anything you want to, do it
Want to change the world?
There's nothing to it`,
	]

	const randomTagline = taglines[Math.floor(Math.random() * taglines.length)]
	return randomTagline
}
module.exports = {
	getRandomTagline,
}
