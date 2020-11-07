const Discord = require('discord.js')
const config = require('./config.json')
const eco = require('discord-economy')
const { isError } = require('util')
const { ENOBUFS, S_IFBLK } = require('constants')
const { FetchBalance } = require('discord-economy')

const client = new Discord.Client()


client.on('message', async message => {
    
    if(message.author.id == client.user.id)
        return
    
    const parts = message.content.split(' ')
    const user = message.mentions.users.first()


    const prefix = 'zc.'
    
    var command = message.content.toLowerCase().slice(prefix.length).split(' ')[0]
    var args = message.content.split(' ').slice(1)

    if (!message.content.startsWith(prefix) || message.author.bot) return

    // Command

    // TODO: Squad Leaders personal banks
    // TODO: Make buyable ranks
    // TODO: Create Action log for bank transfers and whatnot
    // TODO: Make commands not cap sensitive
    // TODO: Advertising features
    // FUTURE: Buying Coupons
    

    if(command == 'help'){
        message.channel.send('**List of commands** \n```zc.help \nzc.balance \nzc.give \nzc.remove```')
    }
    
    if(command === 'balance' || command === 'bal'){
        var output = await eco.FetchBalance(message.author.id)
        message.channel.send(`${message.author} you have ${output.balance} coins.`)
    }

    if(command == 'info'){
        var output = await eco.FetchBalance(user.id)
        message.channel.send(`${user} has a balance of ${output.balance}`)
    }

    if (command == 'delete') {
        if (!user) return message.reply('Please specify a user I have to delete in my database!')
     
        if (!message.guild.me.hasPermission(`ADMINISTRATION`)) return message.reply('You need to be admin to execute this command!')
     
        var output = await eco.Delete(user.id)
        if (output.deleted == true) return message.reply('Successfully deleted the user out of the database!')
     
        message.reply('Error: Could not find the user in database.')
     
      }

    if(command == 'trade'){
        var amount = args[1]

        if (!user) return message.reply('Mentiont the user you want to send money to.')
        if (!amount) return message.reply('Give the amount you want to pay.')

        var output = await eco.FetchBalance(message.author.id)
            if(output.balance < amount) return message.reply(`You don't have enough coins for this action.`)

        var transfer = await eco.Transfer(message.author.id, user.id, amount)
        message.reply(`Transfer complete!\nBalance from ${message.author.tag}: ${transfer.FromUser}\nbalance from ${user.tag}: ${transfer.ToUser}`)
    }


    if(command == 'give'){
        var amount = args[1]
        
        if(!message.member.roles.cache.some(role => role.name == 'leader')) return message.reply('You do not have permissions to use this command.')

        if(!user) return message.reply('Mention the user that you want to give money too.')
        if(!amount) return message.reply('Specify the amount of money you want to give the person')
        
        var output = await eco.AddToBalance(user.id, amount)
        message.reply(`You have gave ${user} ` + amount +  ` coins!`)
        
    }
        
    if(command == 'remove'){
        var amount = args[1]

        if(!message.member.roles.cache.some(role => role.name == 'leader')) return message.reply('You do not have permissions to use this command.')

        if(!user) return message.reply('Mention the user that you want to give money too.')
        if(!amount) return message.reply('Specify the amount of coins you want to remove from their balance')

        var output = await eco.SubtractFromBalance(user.id, amount)
        message.reply(`${amount} has been taken away from ${user}`)
    }

    if(command == 'give'){
        var rank = args[1]

        // Roles
        
        if(!user) return message.reply(`Please mention a user you'd like to give a rank.`)
        if(!rank) return message.reply(`Please enter the role you'd like to give this person`)
        
    }
    
})

client.login(config.BOT_TOKEN)