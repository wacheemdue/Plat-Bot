module.exports = function (message, global, args) {
    const ign = args.join('').toLowerCase();
    if (global[message.guild.id].has(ign)) {
        global[message.guild.id].delete(ign);
        message.channel.send('Successfully deleted!");
    }
    else {
        message.channel.send('ERROR: player not in list.');
    }
}