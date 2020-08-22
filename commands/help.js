const { Client, MessageEmbed, DiscordAPIError, Channel } = require('discord.js');

export default help = () => {
    const str = 
        "$add [summoner name] Adds a player to the list." +
        "\n$delete [summoner name] Deletes a player from the list." +
        "\n$ranks Lists all added players and their ranks." + 
        "\n$rank [summoner name] Shows only the given summoner's rank.";
    message.channel.send(str);
}