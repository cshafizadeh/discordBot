/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
const { SlashCommandBuilder } = require('discord.js');
const { request } = require('undici');
const { EmbedBuilder } = require('discord.js');

async function getJSONResponse(body) {
	let fullBody = '';

	for await (const data of body) {
		fullBody += data.toString();
	}
    const parsing = JSON.parse(fullBody);
	return parsing;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pokemon')
		.setDescription('Replies with a pokemon of your choosing!')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the pokemon')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('shiny')
                .setDescription('If you want the shiny version instead!')),
	async execute(interaction) {
        const query = interaction.options.getString('name');
		const pokemonResult = await request(`https://pokeapi.co/api/v2/pokemon/${query}/`);
        const file = await getJSONResponse(pokemonResult.body);
        const isShiny = interaction.options.getBoolean('shiny');
        let pokemonImg = file.sprites.front_default;
        let pokemonVariant = 'Normal';
        if (isShiny) {
            pokemonImg = file.sprites.front_shiny;
            pokemonVariant = 'Shiny';
        }
        
		const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${file.name[0].toUpperCase() + file.name.substring(1)}`)
            .setURL('https://discord.js.org/')
            .setAuthor({ name: 'Pokemon', iconURL: 'https://cdn.pixabay.com/photo/2016/07/23/13/18/pokemon-1536849__480.png', url: 'https://pokeapi.co/docs/v2' })
            .addFields({ name: 'Type:', value: `${file.types[0].type.name[0].toUpperCase() + file.types[0].type.name.substring(1)}` })
            .addFields({ name: 'Variant:', value: pokemonVariant, inline: true })
            .setImage(`${pokemonImg}`)
            .setTimestamp()
            .setFooter({ text: 'Wanna try? do /pokemon {name}', iconURL: 'https://cdn.pixabay.com/photo/2016/07/23/13/18/pokemon-1536849__480.png' });

        await interaction.reply({ embeds: [exampleEmbed] });
	},
};