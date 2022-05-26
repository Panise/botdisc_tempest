exports.run = (client, message, args) => {
  let toSay = args.join("")
  if (!toSay) return message.channel.send({content: "You Have To Provide Something"})
  message.channel.send({content: toSay})
}