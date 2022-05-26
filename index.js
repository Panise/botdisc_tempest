//CONSTANTS
const express = require('express');
const app = express();
const port = 3000;
const config = require('./config.json');
const size = config.colors;
const rainbow = new Array(size);
const keepAlive = require("./server")
const {readdirSync, read} = require('fs');
const {join} = require('path');
require('dotenv').config();





//required for changing of the color! DONT TOUCH
for (var i = 0; i < size; i++) {
    var red = sin_to_hex(i, 0 * Math.PI * 2 / 3); // 0   deg
    var blue = sin_to_hex(i, 1 * Math.PI * 2 / 3); // 120 deg
    var green = sin_to_hex(i, 2 * Math.PI * 2 / 3); // 240 deg

    rainbow[i] = '#' + red + green + blue;
}
function sin_to_hex(i, phase) {
    var sin = Math.sin(Math.PI / size * 2 * i + phase);
    var int = Math.floor(sin * 127) + 128;
    var hex = int.toString(16);

    return hex.length === 1 ? '0' + hex : hex;
}

let place = 0;
const servers = config.servers;

function changeColor() {
    for (let index = 0; index < servers.length; ++index) {
        let server = client.guilds.cache.get(servers[index]);
        if (!server) {
            if (config.logging) {
                console.log(`[ColorChanger] Server ${servers[index]} was not found. Skipping.`);
            }
            continue;
        }

        let role = server.roles.cache.find(r => r.name === config.roleName);
        if (!role) {
            if (config.logging) {
                console.log(`[ColorChanger] The role ${config.roleName} was not found on the server ${servers[index]}. Skipping.`);
            }
            continue;
        }

        role.setColor(rainbow[place]).catch(console.error);

        if (config.logging) {
            console.log(`[ColorChanger] Changed color to ${rainbow[place]} in server: ${servers[index]}`);
        }
    }

    if (place == (size - 1)) {
        place = 0;
    } else {
        place++;
    }
}

app.get('/', (req, res) => res.send('The bot has turned on!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));


// ================= START BOT CODE ===================
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES], allowedMentions:["user"] });




process.on('warning', (warning) => {
    console.log(warning.stack);
});











//new code that might produce erros delete this to fix bot
//The code call for the COMMANDS folder 
const Discord = require('discord.js')
const fs = require('fs');
const prefix = "?";
client.commands = new Discord.Collection();
const commands = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))
for (file of commands) {
  const commandName = file.split(".")[0]
  const command = require(`./commands/${commandName}`)
  client.commands.set(commandName, command)
}


client.on("messageCreate", message => {
  if(message.content.startsWith(prefix)) {
const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const commandName = args.shift()
    const command = client.commands.get(commandName)
    if(!command) return
  command.run(client, message, args)
  }
})













//Sets the bot activity
const activities_list = [
    { type: 'PLAYING',  message: 'champjr.co | >help'  },
    { type: 'WATCHING', message: 'God himself | >help' },
    { type: 'PLAYING', message: 'The Draconian WAR! | >help' }
];

client.on('ready', () => {
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);

        client.user.setActivity(activities_list[index].message, { type: activities_list[index].type });
    }, 10000);
});
client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}!`);
    if (config.speed < 1) {
        console.log("The minimum speed is 60.000, if this gets abused your bot might get banned");
        process.exit(1);
    }
   setInterval(changeColor, config.speed);
    changeColor();
});

//ping respone command
client.on('messageCreate', msg => {
    if (msg.content === 'ping') { //<-- simple response command
        msg.reply('pong!');  //<-- when ran the bot will respond with that
      }
    });





//removed const discord = require discord.js on line 130

const { DisTube } = require('distube')
const { YtDlpPlugin } = require("@distube/yt-dlp");
var avconv = require('avconv');
const ffmpeg = require('ffmpeg-static');


client.commands = new Discord.Collection();
client.aliaes = new Discord.Collection();
client.snipes = new Discord.Collection();
// Create a new DisTube
const distube = new DisTube(client, {
    searchSongs: 5,
    searchCooldown: 30,
    leaveOnEmpty: false,
    leaveOnFinish: false,
    leaveOnStop: false,
    youtubeDL: false,
    plugins: [new YtDlpPlugin()],
})
const  ytsr = require('@distube/ytsr');
ytsr('DisTube', { safeSearch: true, limit: 1 }).then(result => {
    let song = result.items[0];
    console.log('ID: ' + song.id);
    console.log('Name: ' + song.name);
    console.log('URL: ' + song.url);
    console.log('Views: ' + song.views);
    console.log('Duration: ' + song.duration);
    console.log('Live: ' + song.isLive);
})


client.on('ready', client => {
    console.log(`Logged in as ${client.user.tag}!`)
})
// client.on("debug", console.log)

client.on('messageCreate', message => {
    if (message.author.bot || !message.inGuild()) return
    if (!message.content.startsWith(prefix)) return
    const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g)
        const command = args.shift()


    if (command === 'play') {
        const voiceChannel = message.member?.voice?.channel
        if (voiceChannel) {
            distube.play(voiceChannel, args.join(' '), {
                message,
                textChannel: message.channel,
                member: message.member,
            })
        } else {
            message.channel.send(
                'You must join a voice channel first.',
            )
        }
    }

    if (['repeat', 'loop'].includes(command)) {
        const mode = distube.setRepeatMode(message)
        message.channel.send(
            `Set repeat mode to \`${
                mode
                    ? mode === 2
                        ? 'All Queue'
                        : 'This Song'
                    : 'Off'
            }\``,
        )
    }

    if (command === 'stop') {
        distube.stop(message)
        message.channel.send('Stopped the music!')
    }

    if (command === 'leave') {
        distube.voices.get(message)?.leave()
        message.channel.send('Leaved the voice channel!')
    }

    if (command === 'resume') distube.resume(message)

    if (command === 'pause') distube.pause(message)

    if (command === 'skip') distube.skip(message)

    if (command === 'queue') {
        const queue = distube.getQueue(message)
        if (!queue) {
            message.channel.send('Nothing playing right now!')
        } else {
            message.channel.send(
                `Current queue:\n${queue.songs
                    .map(
                        (song, id) =>
                            `**${id ? id : 'Playing'}**. ${
                                song.name
                            } - \`${song.formattedDuration}\``,
                    )
                    .slice(0, 10)
                    .join('\n')}`,
            )
        }
    }

    if (
        [
            '3d',
            'bassboost',
            'echo',
            'karaoke',
            'nightcore',
            'vaporwave',
        ].includes(command)
    ) {
        const filter = distube.setFilter(message, command)
        message.channel.send(
            `Current queue filter: ${filter.join(', ') || 'Off'}`,
        )
    }
})

// Queue status template
const status = queue =>
    `Volume: \`${queue.volume}%\` | Filter: \`${
        queue.filters.join(', ') || 'Off'
    }\` | Loop: \`${
        queue.repeatMode
            ? queue.repeatMode === 2
                ? 'All Queue'
                : 'This Song'
            : 'Off'
    }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``

// DisTube event listeners, more in the documentation page
distube
    .on('playSong', (queue, song) =>
        queue.textChannel?.send(
            `Playing \`${song.name}\` - \`${
                song.formattedDuration
            }\`\nRequested by: ${song.user}\n${status(queue)}`,
        ),
    )
    .on('addSong', (queue, song) =>
        queue.textChannel?.send(
            `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`,
        ),
    )
    .on('addList', (queue, playlist) =>
        queue.textChannel?.send(
            `Added \`${playlist.name}\` playlist (${
                playlist.songs.length
            } songs) to queue\n${status(queue)}`,
        ),
    )
    .on('error', (textChannel, e) => {
        console.error(e)
        textChannel.send(
            `An error encountered: ${e.message.slice(0, 2000)}`,
        )
    })
    .on('finish', queue => queue.textChannel?.send('Finish queue!'))
    .on('finishSong', queue =>
        queue.textChannel?.send('Finish song!'),
    )
    .on('disconnect', queue =>
        queue.textChannel?.send('Disconnected!'),
    )
    .on('empty', queue =>
        queue.textChannel?.send(
            'The voice channel is empty! Leaving the voice channel...',
        ),
    )
    // DisTubeOptions.searchSongs > 1
    .on('searchResult', (message, result) => {
        let i = 0
        message.channel.send(
            `**Choose an option from below**\n${result
                .map(
                    song =>
                        `**${++i}**. ${song.name} - \`${
                            song.formattedDuration
                        }\``,
                )
                .join(
                    '\n',
                )}\n*Enter anything else or wait 30 seconds to cancel*`,
        )
    })
    .on('searchCancel', message =>
        message.channel.send('Searching canceled'),
    )
    .on('searchInvalidAnswer', message =>
        message.channel.send('Invalid number of result.'),
    )
    .on('searchNoResult', message =>
        message.channel.send('No result found!'),
    )
    .on('searchDone', () => {})


// You really don't want your token here since your repl's code
// is publically available. We'll take advantage of a Repl.it 
// feature to hide the token we got earlier. 

client.login(config.TOKEN)
