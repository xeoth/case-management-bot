const caseChannelID = '686607582420271201';
const archiveChannelID = ''

exports.run = async (client, message, args) => {
  const caseID = args[0];

  if (!caseID) {
    const denialMessage = await message.reply('Sorry, you didn\'t provide the message ID.');
    denialMessage.delete({ timeout: 5000 });
    message.delete({ timeout: 5000 });
  }

  
}