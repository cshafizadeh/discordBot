const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Replies with User Info!'),
	async execute(interaction) {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour ID: ${interaction.user.id}`);
	},
};