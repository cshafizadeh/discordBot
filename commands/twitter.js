/* eslint-disable no-var */
/* eslint-disable comma-dangle */
/* eslint-disable indent */

// eslint-disable-next-line no-unused-vars
const { bearerToken } = require('../secrets.json');
const { SlashCommandBuilder } = require('discord.js');
var request = require('request');

var options = {
    'method': 'GET',
    'url': 'https://api.twitter.com/2/tweets/1553085334350483456?tweet.fields=created_at&expansions=author_id',
    'headers': {
      'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAACxffQEAAAAAxU7LK9oCsCFK3xezphG%2BqM0GyeE%3DONfbFnaVuKe0xyMV9ur6CYw56wybe7h57RlbtKAJHs9vaPnOvH',
      'Cookie': 'guest_id=v1%3A165919945357901144'
    }
  };


module.exports = {
	data: new SlashCommandBuilder()
		.setName('twitter')
		.setDescription('Get someones tweets!'),
	async execute(interaction) {
        request(options, function(error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
          });
		await interaction.reply('Pong!');
	},
};
