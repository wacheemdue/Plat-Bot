const { Client, MessageEmbed, DiscordAPIError } = require('discord.js');
const fetch = require('node-fetch');
const client = new Client();
const prefix = '!';

const k = 'RGAPI-f7b139d8-6817-45d8-a13a-3b6909da6332';

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
<<<<<<< HEAD
            }
            const {tier, rank, summonerName, leaguePoints} = soloq;
            const str = `${summonerName} is ${tier} ${rank} ${leaguePoints.toString()} lp.`;
            message.channel.send(str);
            
=======
			}
        const {tier, rank, summonerName, leaguePoints} = soloq;
		const str = `${summonerName} is ${tier} ${rank} ${leaguePoints.toString()} lp.`;
		message.channel.send(str);
		tierImage(tier);
>>>>>>> f99fddcb6b101375f7f07b1bc3f1f211663df5a5
        });
	}

	async function tierImage(str)
	{
		let tierPieces = new Map();
		tierPieces.set('IRON', 'https://i.imgur.com/pmkjo8T.png');
		tierPieces.set('BRONZE', 'https://i.imgur.com/KnJMWka.png');
		tierPieces.set('SILVER', 'https://i.imgur.com/fnLbprT.png');
		tierPieces.set('GOLD', 'https://i.imgur.com/qdcHMVp.png');
		tierPieces.set('PLATINUM', 'https://i.imgur.com/xR2R4mt.png');
		tierPieces.set('DIAMOND', 'https://i.imgur.com/VG4Urmj.png');
		tierPieces.set('MASTERS', 'https://i.imgur.com/HirESXG.png');
		tierPieces.set('GRANDMASTER', 'https://i.imgur.com/Go0Ou9X.png');
		tierPieces.set('CHALLENGER', 'https://i.imgur.com/mt3apd6.png');

		message.channel.send(tierPieces.get(str));
	}

});


client.login('');
