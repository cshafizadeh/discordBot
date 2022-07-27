const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('noah')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('loves man cock and also ass');
	},
};