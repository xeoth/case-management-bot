
async function rejectMessage(message, rejectionMessage) {
  const denialMessage = await message.reply(rejectionMessage);
  denialMessage.delete({ timeout: 5000 });
  message.delete({ timeout: 5000 });
}

exports.run = async (client, message, args) => {
  if (!message.member.roles.cache.some(r => r.id === client.config.mapperRoleID)) return message.reply('Insufficient permissions.');

  const caseID = args[0];
  if (!caseID) return rejectMessage(message, 'Sorry, you didn\'t provide the message ID.');

  // remove the first argument (ID)
  args.shift();
  const comment = args.join(' ');
  if (!comment) return rejectMessage(message, 'Sorry, you didn\'t provide a comment.');

  const caseChannel = await client.channels.fetch(client.config.caseChannelID);

  let messageExists = true;
  const caseMessage = await caseChannel.messages.fetch(caseID)
      .catch(e => messageExists = false);

  if (!messageExists) return rejectMessage(message, 'Sorry, the case with the provided ID does not exist.');

  const caseEmbed = caseMessage.embeds[0];

  // get the discussions, if any
  if (caseEmbed.fields[2]) {
    // get any previous comments
    let discussions = caseEmbed.fields[2].value;

    // remove the field
    caseEmbed.spliceFields(caseEmbed.fields.indexOf({ name: 'Comments', value: discussions }), 1);

    // add the comment to already existing discussions
    discussions += `\n${message.author.username}: ${comment}`;

    caseEmbed.addField('Comments', discussions);
  } else {
    caseEmbed.addField('Comments', `${message.author.username}: ${comment}`);
  }

  caseMessage.edit('', caseEmbed);
}