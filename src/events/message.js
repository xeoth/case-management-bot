const Discord = require('discord.js');

// allowed webhook IDs
const allowedHooks = [
  '533373537755332610',
  '687231668062388234'
];

module.exports = async (client, message) => {

  if (message.author.bot && !allowedHooks.includes(message.webhookID)) {
    return;
  }

  if (message.content.indexOf(client.config.prefix) !== 0) return;
  const prefixLen = client.config.prefix.length;
  const args = message.content.slice(prefixLen).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command);
  if (!cmd) return;
  cmd.run(client, message, args);
};