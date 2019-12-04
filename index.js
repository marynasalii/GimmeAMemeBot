require("dotenv").config();
const axios = require("axios");
const telegram = require("telegram-bot-api");

const memeApiUrl = process.env.MEME_API_URL;

const api = new telegram({
	token: process.env.TELEGRAM_API_TOKEN,
	updates: {
		enabled: true,
		get_interval: 1000
	}
});

api.on("message", (message) => {

	if (message.text === "/start") {
		api.sendMessage({
			chat_id: message.chat.id,
			text: "<strong> Welcome to the GimmeAMemeBot! </strong> \n\nPlease type <code>'gimme a meme'</code> if you want to get a random meme from reddit. \nIf you want to get a meme from a specific subreddit please type <code>'r/subreddit name'</code>. ",
			parse_mode: "HTML" 
		});

	} else if (message.text === "gimme a meme") {
		axios.get(memeApiUrl).then(response => {
			api.sendPhoto({
				chat_id: message.chat.id,
				caption: response.data.title,
				photo: response.data.url
			});
		}).catch(error => {
			sendErrorMessage();
			sendMessage(error);
		});

	} else if (message.text.match(/r\//g)) {
		let subreddit = message.text.split("/")[1];
		axios.get(memeApiUrl + "/" +  subreddit).then(response => {
			api.sendPhoto({
				chat_id: message.chat.id,
				caption: response.data.title,
				photo: response.data.url
			});
		}).catch(() => {
			sendErrorMessage();
			sendMessage(error);
		});

	} else {
		sendErrorMessage();
		sendMessage(error);
	}
});

const sendErrorMessage = () => {
	api.sendMessage({
		chat_id: message.chat.id,
		text: "Sorry, i don't understand you. Please try again."
	});
}
