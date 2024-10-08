const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Replies with Server Info!'),
	async execute(interaction) {
		console.log(interaction.guild.createdAt.toDateString())
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}\nThis Server was Created On: ${interaction.guild.createdAt.toDateString()}`);
	},
};