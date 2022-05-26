module.exports = {
  name: "skip",
  description: "skip a song",
  async run (bot, message, args) {
    if(!messsage.member.voice.channel) return message.reply("Please join a voice channel!");

    await client.distube.skip(message)
    await message.channel.send("Skipped current song!")
  }
}