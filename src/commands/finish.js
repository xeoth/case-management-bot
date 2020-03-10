const caseChannelID = '686607582420271201';
const archiveChannelID = '12345'

async function rejectMessage(message, rejectionMessage) {
  const denialMessage = await message.reply(rejectionMessage);
  denialMessage.delete({ timeout: 5000 });
  message.delete({ timeout: 5000 });
}

exports.run = async (client, message, args) => {
  const caseID = args[0];

  // reject if message id was not provided
  if (!caseID) return rejectMessage(message, 'Sorry, you didn\'t provide the message ID.');

  // fetch the channel with case queue and the message with the provided ID
  const caseChannel = await client.channels.fetch(caseChannelID);
  const caseMessage = await caseChannel.messages.fetch(caseID);

  // reject if message does not exist
  if (!caseMessage) return rejectMessage(message, 'Sorry, the message with the provided ID does not exist.');
  
  // fetch the message in the embed
  const caseEmbed = caseMessage.embeds[0];

  // change color from orange to green
  caseEmbed.setColor('#35de35');

  // TODO: finish the sending and change the title
  const archiveChannel = await client.channels.fetch(archiveChannelID);
  archiveChannel
}