const { Client, MessageEmbed, DiscordAPIError, Channel } = require('discord.js');

module.exports = function (message, global) {
    global[message.guild.id].clear();
	message.channel.send("Successfully deleted all players from list.");
}