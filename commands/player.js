const { SlashCommandBuilder } = require('@discordjs/builders');
const { generateDependencyReport, AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, create AudioResource } = require('@discordjs/voice');
const config = require('../config.json');

module.exports = { 
    data: new SlashCommandBuilder()
            .setName('play')
            .setDescription('Plays Music in Voice Chat!'),
    async execute(interaction, client){ 
        const voiceChannelId = config.musicChannelId;
        const voiceChannel = client.channels.cache.get(voiceChannelId);
        const guildId = config.guildId;

        const player = createAudioPlayer();

        player.on(AudioPlayerStatus.Playing, () => {
                console.log('The music has started playing!');
        });
        player.on('error', error => {
                console.error('An error has occurred: ${error.message} with resource');
        });

        //const resource = createAudioResource(INPUT)
        player.play(resource);

        const connection = joinVoiceChannel({
            channelId: voiceChannelId,
            guildId: guildId,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        interaction.replay("Created voice connection")

        const subscription = connection.subscribe(player);

        if (subscription) {
            setTimeout(() => subscription.unsubscribe(), 30_000);
        }
    },
};