const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('noah')
		.setDescription('Noah loves his nuts!'),
	async execute(interaction) {
		await interaction.reply('loves eating nuts');
	},
};