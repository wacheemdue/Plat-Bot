const fetch = require('node-fetch');

module.exports = async function(message, global, args) {
    const ign = args.join('').toLowerCase();
    const info = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${ign}?api_key=${process.env.RIOT_KEY}`).then(response => response.json());
    
    if ("status" in info) {
        if (info.status.status_code === 404) {
            message.channel.send('ERROR: player does not exist.' );
        }
    }
    else if(!global[message.guild.id].has(ign)) {
        global[message.guild.id].set(ign, {id: info.id, profileIconId: info.profileIconId});
        message.channel.send('Successfully added!');
    }
    else {
        message.channel.send('ERROR: player ' + ign + ' already exists.' );
    }
}