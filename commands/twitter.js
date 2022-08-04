/* eslint-disable no-shadow */
/* eslint-disable no-inline-comments */
/* eslint-disable no-var */
/* eslint-disable comma-dangle */
/* eslint-disable indent */

// eslint-disable-next-line no-unused-vars
const { bearerToken } = require('../secrets.json');
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const token = require('../secrets.json');
const needle = require('needle');
const user = require('./user');


async function getUserRequest(name) {
  const endpointURL = 'https://api.twitter.com/2/users/by?usernames=';

  const params = {
    usernames: `${name}`,
    'user.fields': 'created_at,description',
    'expansions': 'pinned_tweet_id'
  };

  const res = await needle('get', endpointURL, params, {
    headers: {
        'User-Agent': 'v2UserLookupJS',
        'authorization': `Bearer ${token.bearerToken}`
    }
  });

  if (res.body) {
      return res.body;
  }
  else {
      throw new Error('Unsuccessful request');
  }
}


const getUserTweets = async (userId) => {
  const url = `https://api.twitter.com/2/users/${userId}/tweets`;
  const userTweets = [];

  // we request the author_id expansion so that we can print out the user name later
  const params = {
      'max_results': 5,
      'tweet.fields': 'created_at',
      'expansions': 'author_id'
  };

  const options = {
      headers: {
          'User-Agent': 'v2UserTweetsJS',
          'authorization': `Bearer ${token.bearerToken}`
      }
  };

  let hasNextPage = true;
  let nextToken = null;
  let userName;
  console.log('Retrieving Tweets...');

  let num = 0;
  while (hasNextPage && num < params.max_results) {
      const resp = await getPage(params, options, nextToken, url);
      if (resp && resp.meta && resp.meta.result_count && resp.meta.result_count > 0) {
          userName = resp.includes.users[0].username;
          if (resp.data) {
              userTweets.push.apply(userTweets, resp.data);
          }
          if (resp.meta.next_token) {
              nextToken = resp.meta.next_token;
          }
 else {
              hasNextPage = false;
          }
      }
 else {
          hasNextPage = false;
      }
      num += 1;
  }
/*
  console.dir(userTweets, {
      depth: null
  });
  */
  console.log(`Got ${userTweets.length} Tweets from ${userName} (user ID ${userId})!`);
  return userTweets;

};

const getPage = async (params, options, nextToken, url) => {
  if (nextToken) {
      params.pagination_token = nextToken;
  }

  try {
      const resp = await needle('get', url, params, options);

      if (resp.statusCode != 200) {
          console.log(`${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`);
          return;
      }
      return resp.body;
  }
 catch (err) {
      throw new Error(`Request failed: ${err}`);
  }
};

async function getTweetRequest(userId) {
  const endpointURL = 'https://api.twitter.com/2/tweets?ids=';
  const params = {
      'ids': `${userId}`, // Edit Tweet IDs to look up
      'tweet.fields': 'lang,author_id', // Edit optional query parameters here
      'user.fields': 'created_at' // Edit optional query parameters here
  };

  const res = await needle('get', endpointURL, params, {
      headers: {
          'User-Agent': 'v2TweetLookupJS',
          'authorization': `Bearer ${token.bearerToken}`
      }
  });

  if (res.body) {
      return res.body;
  }
 else {
      throw new Error('Unsuccessful request');
  }
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('twitter')
		.setDescription('Get someones tweets!')
    .addStringOption(option =>
      option.setName('options')
        .setDescription('The list of twitter commands')
        .setRequired(true)
        .addChoices(
          { name: 'info', value: 'info' },
          { name: 'recent', value: 'recent' },
    ))
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The username of Twitter account')
        .setRequired(true)),
	async execute(interaction) {
    const query = interaction.options.getString('name');
    const removeSpaces = query.replace(/\s+/g, '');
    var test = await getUserRequest(removeSpaces);
    console.log('This is a test:', test);
    if (!test.data[0].description) {
      test.data[0].description = 'None';
    }
    const userId = test.data[0].id;

    if (interaction.options.getString('options') === 'recent') {
      const tweet = await getTweetRequest(userId);
      console.log('Tweet: ', tweet);
      await interaction.reply('Hold tight while we get the tweets from this user... (this could take a minute)');
      const userTweets = await getUserTweets(userId);
      console.log(userTweets[0]);
      if (!userTweets[0]) {
        await interaction.editReply('Sorry that user either hasnt Tweeted anything yet or does not exist');
      } else {
        await interaction.editReply('WE GOT EM!');
      }
    }
    console.log(interaction.options.getString('options'));

    if (interaction.options.getString('options') === 'info') {
      await interaction.reply('Hold tight while we get the info about this user... (this could take a minute)');
      const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(test.data[0].name)
      .addFields({ name: 'Info:', value: test.data[0].description })
      .setURL(`https://twitter.com/${test.data[0].username}`)
      .setTimestamp()
      .setFooter({ text: 'Wanna try? do /twitter {name}' });

      await interaction.editReply({ embeds: [exampleEmbed] });
    }

	},
};
