module.exports = {
  name: "stop",
  description: "stop playing a song",
  
  async run (bot, message, args) {
    if(!messsage.member.voice.channel) return message.reply("Please join a voice channel!");
  await client.distube.stop(mesage)
    await mesage.channel.send("**Stopped Playing!**")
  }
}