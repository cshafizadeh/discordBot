const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('noah')
		.setDescription('He really loves men'),
	async execute(interaction) {
		await interaction.reply('loves man cock and also ass');
	},
};