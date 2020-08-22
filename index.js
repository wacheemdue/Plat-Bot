const { Client, MessageEmbed, DiscordAPIError, Channel } = require('discord.js');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const help = require('./commands/help');
const add = require('./commands/add');
const del = require('./commands/delete');
const delAll = require('./commands/deleteAll');
const ranks = require('./commands/ranks');
const rank = require('./commands/rank');

const client = new Client();
const prefix = '$';


dotenv.config({ path: '.env' });

let global = {};

client.once('ready', () => {
	console.log('rd');
});

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);

	const command = args.shift().toLowerCase();
    // ...
    if (!(message.guild.id in global)) {
        global[message.guild.id] = new Map();
    }
    switch(command) {
        case 'help':
            help(message);
            break;
        case 'add':
            add(message, global, args);
            break;
        case 'delete':
            del(message, global, args);
            break;
        case 'deleteall':
            delAll(message, global);
            break;
        case 'ranks':
            ranks(message, global);
            break;
        case 'rank':
            rank(message, args);
            break;
        default:
    }
});

client.login(process.env.BOT_KEY);
