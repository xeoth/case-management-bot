
async function rejectMessage(message, rejectionMessage) {
  const denialMessage = await message.reply(rejectionMessage);
  denialMessage.delete({ timeout: 5000 });
  message.delete({ timeout: 5000 });
}

// !close <id> [comment]
exports.run = async (client, message, args) => {
   
  // checking whether the member has the necessary role
  if (!message.member.roles.cache.some(r => r.id === client.config.mapperRoleID)) return message.reply('Insufficient permissions.');

  const caseChannelID = client.config.caseChannelID;
  const archiveChannelID = client.config.archiveChannelID;
  const caseID = args[0];

  // remove the first argument (ID)
  args.shift();

  const comment = args.join(' ');

  // reject if message id was not provided
  if (!caseID) return rejectMessage(message, 'Sorry, you didn\'t provide the message ID.');

  // fetch the channel with case queue and the message with the provided ID
  const caseChannel = await client.channels.fetch(caseChannelID);

  // fetch the message and check whether the message exists 
  let failedMessage = false;
  const caseMessage = await caseChannel.messages.fetch(caseID)
      .catch((e) => {
        rejectMessage(message, 'Sorry, the case with the provided ID does not exist.');
        failedMessage = true;
      });
  
  // exit the script instead of throwing an error
  if (failedMessage) return;

  // fetch the message in the embed
  const caseEmbed = caseMessage.embeds[0];

  // make changes to the embed to differentiate it from the active one
  caseEmbed
      .setColor('#ff0000')
      .setTitle('Case closed')
      .setFooter(`Case archived by ${message.author.username}`, message.author.avatarURL());


  if (comment) caseEmbed.addField('Reason for closing', comment);
  
  const archiveChannel = await client.channels.fetch(archiveChannelID);
  archiveChannel.send(caseEmbed);

  caseMessage.delete( { timeout: 0 });
  message.delete( { timeout: 0 } );
}