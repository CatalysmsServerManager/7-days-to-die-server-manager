module.exports = async function adminRestart(msg) {

  const admins = sails.config.custom.adminSteamIds;
  const adminUsers = await User.find({
    where: {
      steamId: admins,
      discordId: msg.author.id
    }
  });

  if (adminUsers.length) {
    await msg.reply(`Request received, I'm shutting down now. 🤖`);
    return process.exit();
  } else {
    return msg.reply(`I do not know you! Make sure you have linked your Discord ID to CSMM and you are listed as a CSMM admin in the env variables.`);
  }
};
