const { Client, MessageEmbed, DiscordAPIError } = require('discord.js');
const fetch = require('node-fetch');
const client = new Client();
const prefix = '!';

const k = 'RGAPI-3c385c11-c8b6-4c72-a77c-c5c44751f1c6';

let players = new Map();

client.once('ready', () => {
	console.log('rd');
});

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);

	const command = args.shift().toLowerCase();
    // ...
    if (command === 'add') {
        const ign = args.join(' ');
        const info = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${ign}?api_key=${k}`).then(response => response.json());
        players.set(ign, info.id);
    }

    if (command === 'delete') {
        const ign = args.join(' ');
        if (players.has(ign)) {
            players.delete(ign);
        }
        console.log(players);
    }


    if (command === 'ranks') {
        console.log(players);
        players.forEach( async (value, key) => {
            const info = await fetch(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${value}?api_key=${k}`).then(response => response.json());
            let soloq = {};
            for (const element of info) {
                if (element.queueType === 'RANKED_SOLO_5x5') {
                    soloq = element;
                    break;
                }
            }
            const {tier, rank, summonerName, leaguePoints} = soloq;
            const str = `${summonerName} is ${tier} ${rank} ${leaguePoints.toString()} lp.`;
            message.channel.send(str);
            
        });
    }
});

client.login('NzQzNjM3NzYxNTg3ODA2MzY4.XzXkog.txE08owJFPALoVWtBWdHTJ2IwmA');