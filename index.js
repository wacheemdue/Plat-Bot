const { Client, MessageEmbed, DiscordAPIError, Channel } = require('discord.js');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const client = new Client();
const prefix = '!';

dotenv.config({ path: '.env' });

let players = new Map();
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

client.once('ready', () => {
	console.log('rd');
});

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);

	const command = args.shift().toLowerCase();
    // ...
    if (command === 'help') {
        const str = 
            "add [summoner name] Adds a player to the list." +
            "\ndelete [summoner name] Deletes a player from the list." +
            "\nranks Lists all added players and their ranks."
        message.channel.send(str);
    }


    if (command === 'add') {
        const ign = args.join('').toLowerCase();
        const info = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${ign}?api_key=${process.env.RIOT_KEY}`).then(response => response.json());

        if (info.status === 404) {
            message.channel.send('ERROR: player does not exist.' );
        }
        else if(!players.has(ign)) {
            players.set(ign, {id: info.id, profileIconId: info.profileIconId});
            message.channel.send('Successfully added ' + ign + ".");
        }
        else {
            message.channel.send('ERROR: player ' + ign + ' already exists.' );
        }
    }

    if (command === 'delete') {
        const ign = args.join('').toLowerCase();
        if (players.has(ign)) {
            players.delete(ign);
            message.channel.send('Successfully deleted ' + ign + ".");
        }
        else
        {
            message.channel.send('ERROR: player ' + ign + ' does not exist.');
        }
        console.log(players);
    }

    if (command === 'ranks') {
        console.log(players);
        players.forEach( async (value, key) => {
            const info = await fetch(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${value.id}?api_key=${process.env.RIOT_KEY}`).then(response => response.json());
            let soloq = {};
            for (const element of info) {
                if (element.queueType === 'RANKED_SOLO_5x5') {
                    soloq = element;
                    break;
                }
            }
        
            //formatting and sending embedded image
            const {tier, rank, summonerName, leaguePoints} = soloq;
            const s = summonerName.toLowerCase().replace(/ /g,'');
            const profIcon = players.get(s).profileIconId.toString();
            const str = `${tier} ${rank} ${leaguePoints.toString()} lp`;
            const embed = new MessageEmbed()
                .setColor('#00c3ff')
                .setTitle(str)
                .setAuthor(summonerName,
                `http://ddragon.leagueoflegends.com/cdn/10.16.1/img/profileicon/${profIcon}.png`,
                `https://na.op.gg/summoner/userName=${summonerName.replace(/ /g, '+')}`)
                .setDescription(`https://na.op.gg/summoner/userName=${summonerName.replace(/ /g, '+')}`)
                .setThumbnail(tierPieces.get(tier));

            message.channel.send(embed);
        });
	}
});

client.login(process.env.BOT_KEY);
