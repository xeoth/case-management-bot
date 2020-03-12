const Discord = require('discord.js');

// allowed webhook IDs
// syntax is: { 'webhookID': 'channelID' }
// the channelID should be an ID of a channel where the copy of a case should go
// after it's archived. If there's no such channel, don't add the hook ID here
const hookChannels = [
  { '687231668062388234': '685582487606263905' }
];

module.exports = async (client, message) => {
  // disallow all bots, allow all webhooks, and set the bot not to ignore itself
  if (message.author.bot && !message.webhookID && message.author.id != client.user.id) {
    return;
  }

  // cc the message to an appropriate channel if sent by a hook when archived
  if (message.channel.id === client.config.archiveChannelID && message.author.id === client.user.id) {
    const embed = message.embeds[0];

    // get channel based on webhook ID
    let ccChannelID;
    hookChannels.forEach((element) => {
      if (element.hasOwnProperty(embed.author.name)) ccChannelID = element[embed.author.name];
    });

    if (!ccChannelID) return;

    ccChannel = await client.channels.fetch(ccChannelID);

    ccChannel.send('Copy of an archived case:', { embed: embed });
  }

  if (message.content.indexOf(client.config.prefix) !== 0) return;
  const prefixLen = client.config.prefix.length;
  const args = message.content.slice(prefixLen).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command);
  if (!cmd) return;
  cmd.run(client, message, args);
};