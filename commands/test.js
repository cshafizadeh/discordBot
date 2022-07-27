const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('This is a test to see if it works'),
	async execute(interaction) {
		await interaction.reply('Testing 1 2 4...');
	},
};