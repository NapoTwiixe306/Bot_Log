require('dotenv').config();

const Discord = require('discord.js'),
    client = new Discord.Client({
        fetchAllMembers: true
    }),
    config = require('./config.json'),
    fs = require('fs')
 

client.login(process.env.TOKEN)
client.commands = new Discord.Collection()


client.on("ready", () => {
    console.log("j'suis co mec");
    client.user.setActivity("Look tes Foutus-Logs")
})

fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    })     
})
 
client.on('message', message => {
    if (message.type !== 'DEFAULT' || message.author.bot) return
 
    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    if(command.guildOnly && !message.guild) return message.channel.send('cette commande ne peut être utilisé que dans un serveur')
    command.run(message, args, client)
})
 
client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`${member}`, new Discord.MessageEmbed()
        .setDescription(`${member} a rejoint le serveur. Nous sommes désormais ${member.guild.memberCount} ! 🎉`)
        .setColor('#00ff00'))
    member.roles.add(config.greeting.role)
})
 
client.on('guildMemberRemove', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(new Discord.MessageEmbed()
        .setDescription(`${member.user.tag} est parti.... 😢`)
        .setColor('#ff0000'))
})