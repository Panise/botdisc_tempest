const Discord = require("discord.js")
exports.run = (client, message, args) => {
  message.channel.send("shutting down...").then(message)
      client.destroy();
  }