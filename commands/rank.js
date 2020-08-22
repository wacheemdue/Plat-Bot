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

module.exports =  async function(message, args) {
    const ign = args.join('').toLowerCase();
    const idInfo = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${ign}?api_key=${process.env.RIOT_KEY}`).then(response => response.json());
    const info = await fetch(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${idInfo.id}?api_key=${process.env.RIOT_KEY}`).then(response => response.json());
    const id = idInfo.id;
    const profileIconId = idInfo.profileIconId;
    let soloq = {};
    for (const element of info) {
        if (element.queueType === 'RANKED_SOLO_5x5') {
            soloq = element;
            break;
        }
    }
    
    //formatting and sending embedded image
    const {tier, rank, summonerName, leaguePoints, wins, losses} = soloq;
    const profIcon = profileIconId.toString();
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
        .addField('Total games: ' + totalGames + ' (Win ratio ' + winRate.toFixed(1) + '%)', `Wins: ${wins} | Losses : ${losses}`);
    message.channel.send(embed);
}