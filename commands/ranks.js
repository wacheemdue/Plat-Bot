const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

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

module.exports = async function(message, global) {
    console.log(global[message.guild.id]);
    if (global[message.guild.id].size === 0) {
        message.channel.send('No summoners added.\n$help to see commands.');
    }
    global[message.guild.id].forEach( async (value, key) => {
        const info = await fetch(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${value.id}?api_key=${process.env.RIOT_KEY}`).then(response => response.json());
        let soloq = {};
        
        if (info.length === 0) { //if player is UNRANKED
            const {name} = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/${value.id}?api_key=${process.env.RIOT_KEY}`).then(response => response.json());
            const sumNameLow = name.toLowerCase().replace(/ /g,'');
            const profIcon = global[message.guild.id].get(sumNameLow).profileIconId.toString();
            const embed = new MessageEmbed()
                .setColor('#00c3ff')
                .setTitle('UNRANKED')
                .setAuthor(name,
                `http://ddragon.leagueoflegends.com/cdn/10.16.1/img/profileicon/${profIcon}.png`,
                `https://na.op.gg/summoner/userName=${name.replace(/ /g, '+')}`)
                .setDescription(`https://na.op.gg/summoner/userName=${name.replace(/ /g, '+')}`)
                .setThumbnail('https://strongsocials.com/wp-content/uploads/2019/08/omegalul-meaning-explanation.png');
            message.channel.send(embed);
        }
        else { //if player is RANKED
            for (const element of info) {
                if (element.queueType === 'RANKED_SOLO_5x5') {
                    soloq = element;
                    break;
                }
            }
        
            //formatting and sending embedded image
            const {tier, rank, summonerName, leaguePoints, wins, losses} = soloq;
            const sumNameLow = summonerName.toLowerCase().replace(/ /g,'');
            const profIcon = global[message.guild.id].get(sumNameLow).profileIconId.toString();
            const rankDescrpt = `${tier} ${rank} ${leaguePoints.toString()} lp`;
            const totalGames = wins + losses;
            const winRate = (wins / totalGames) * 100;
            const embed = new MessageEmbed()
                .setColor('#00c3ff')
                .setTitle(rankDescrpt)
                .setAuthor(summonerName,
                `http://ddragon.leagueoflegends.com/cdn/10.16.1/img/profileicon/${profIcon}.png`,
                `https://na.op.gg/summoner/userName=${summonerName.replace(/ /g, '+')}`)
                .setDescription(`https://na.op.gg/summoner/userName=${summonerName.replace(/ /g, '+')}`)
                .setThumbnail(tierPieces.get(tier))
                .addField('Total games: ' + totalGames + ' (Win ratio : ' + winRate.toFixed(1) + '%)', `Wins: ${wins} | Losses : ${losses}`);
            message.channel.send(embed);
        }
    });
}
