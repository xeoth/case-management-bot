const Discord = require('discord.js');
const caseChannelID = '686607582420271201'; // ID of the channel
 
exports.run = (client, message, args) => {
  // !case [desc] [link]
 

  // define variables provided in the command
  const newArgs = args.join(' ').split('http');
  let desc = newArgs[0];
  let link = newArgs[1];

  // check whether the user provided a source link and refuse to add case if it's missing
  if (!link) return message.reply('Sorry, we need a relevant source link. Please execute the command again with the link added __at the end__.\nExample: `!case 1 confirmed in London https://example.com/source`')

  // add the 'http' since it's removed in .split()
  link = 'http' + link;

  // since MessageEmbed values can't be empty, use a placeholder if the user didn't provide any
  if (!desc) desc = 'No description provided.';
 
  // send the message to include the ID in the embed
  // TODO: research whether you can do it after sending
  const caseChannel = message.guild.channels.cache.get(caseChannelID);
  const caseMessage = await caseChannel.send('*Loading the embed...*');

  // construct the actual embed
  const caseEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL())
      .setTitle('New case!')
      .addField('Description', desc)
      .setFooter(`The message ID for this case is: ${caseMessage.id}`)
      .setColor('#ff6f00');
    
  // check whether the link isn't really long. if it is, replace it with a friendly message
  if (link.length > 40) {
    caseEmbed.addField('Relevant link', `[Link exceeded max. characters. Click here to follow.](${link})`);
  } else {
    caseEmbed.addField('Relevant link', link);
  }


  // at last, remove the content of the message and add the embed
  caseMessage.edit('', { embed: caseEmbed });

}
