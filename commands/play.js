exports.run = (client, message, args) => {
  const music = args.join("");
  client.distube.play(message, music)
}

module.exports.config= {
  name: "play",
  aliases: ["P"],
  description: "play a song",
  async run (bot, message, args) {
    if(!messsage.member.voice.channel) return message.reply("Please join a voice channel!");

    const music = args.join(""); //play <args (song name)>
    if(!music) return message.reply("Please provide a song!") //.play

    await client.distube.play(message, music)
  }
}