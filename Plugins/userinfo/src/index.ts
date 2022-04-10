import { EnmitySectionID, Command, ApplicationCommandInputType, ApplicationCommandType, ApplicationCommandOptionType } from "enmity-api/commands";
import { sendReply } from "enmity-api/clyde";
import { Plugin, registerPlugin } from "enmity-api/plugins";
import { getUser, fetchCurrentUser } from "enmity-api/users";
import { User } from "enmity-api/common";

function convertSnowflakeToDate(snowflake) {
  const date = new Date(snowflake / 4194304 + 1420070400000);
  const then = Math.round(date.getTime() / 1000);
  return `<t:${then}>`;
}
async function getAvatar(user: User) {
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=2048`;
}
const ExamplePlugin: Plugin = {
  name: "userinfo",
  commands: [],

  onStart() {
    const helloWorldCommand: Command = {
      id: "user-info-command",
      applicationId: EnmitySectionID,
    
      name: "userinfo",
      displayName: "userinfo",

      description: "Get info about a user",
      displayDescription: "Get info about a user",
    
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltIn,

      options: [{
        name: "user",
        displayName: "user",

        description: "User to retrieve info for",
        displayDescription: "User to retrieve info for",

        type: ApplicationCommandOptionType.User,
        required: false,
      }],

      execute: async function(args, message) {
        let id =  await fetchCurrentUser().then(res => res.id);
        const user = await getUser(args.length == 0 ? id : args[0].value);
        const avatar = await getAvatar(user);
        const embed = {
          type: 'rich',
          title: `${user.username}#${user.discriminator}'s info`,
          image: {
            proxy_url: avatar,
            url: avatar,
            width: 2048,
            height: 2048
          },
          fields: [
            {
              name: "Bio",
              value: user.bio,
              inline: true
            },
            {
              name: "Creation Date",
              value: convertSnowflakeToDate(user.id),
              inline: true
            },
            {
              name: "ID",
              value: user.id,
              inline: true
            },
            {
              name: "Bot",
              value: user.bot? "Yes" : "No",
              inline: true
            }
          ],
          footer: {
            text: "Made by nab138 || nabdev.tk"
          },
          color: user.accentColor ?? '0xad7f3e'
        }
        sendReply(message.channel.id, {embeds: [embed], components: []}, user.username, avatar);
      }
    }

    this.commands.push(helloWorldCommand);
  },

  onStop() {
    this.commands = [];
  }
}

registerPlugin(ExamplePlugin);
