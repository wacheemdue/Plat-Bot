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
    if (command === 'add') {
        const ign = args.join(' ').toLowerCase();
        const info = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${ign}?api_key=${process.env.RIOT_KEY}`).then(response => response.json());
        players.set(ign, {id: info.id, profileIconId: info.profileIconId});
    }

    if (command === 'delete') {
        const ign = args.join(' ').toLowerCase();
        if (players.has(ign)) {
            players.delete(ign);
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
        const {tier, rank, summonerName, leaguePoints} = soloq;
        const profIcon = players.get(summonerName.toLowerCase()).profileIconId;
		const str = `${tier} ${rank} ${leaguePoints.toString()} lp`;
        const embed = new MessageEmbed()
            .setColor('#00c3ff')
            .setTitle(str)
            .setAuthor(summonerName,
             `http://ddragon.leagueoflegends.com/cdn/10.16.1/img/profileicon/${profIcon}.png`,
             `https://na.op.gg/summoner/userName=${summonerName}`)
            .setDescription(`https://na.op.gg/summoner/userName=${summonerName}`)
            .setImage(tierPieces.get(tier));

        message.channel.send(embed);
        });
	}
});

// Following code pings express server every <5 minutes to keep bot hosting active
const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

client.login(process.env.BOT_KEY);
