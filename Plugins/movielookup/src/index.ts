import { EnmitySectionID, Command, ApplicationCommandInputType, ApplicationCommandType, ApplicationCommandOptionType } from "enmity-api/commands";
import { sendReply } from "enmity-api/clyde";
import { Plugin, registerPlugin } from "enmity-api/plugins";
import { get, RestOptions } from "enmity-api/rest";

let api_key = "6069c5361378a50d0fb5ff3a58e6bba8";
const ExamplePlugin: Plugin = {
  name: "movielookup",
  commands: [],

  onStart() {
    const getMovieCommand: Command = {
      id: "movie-info-command",
      applicationId: EnmitySectionID,
    
      name: "movie",
      displayName: "movie",

      description: "Get info about a movie",
      displayDescription: "Get info about a movie",
    
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltIn,

      options: [{
        name: "movie",
        displayName: "movie",

        description: "Movie to look up",
        displayDescription: "Movie to look up",

        type: ApplicationCommandOptionType.String,
        required: true,
      }],

      execute: async function(args, message) {
        const movie = JSON.parse((await get(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodeURI(args[0].value)}`)).text).results[0];
        if(!movie) {
          return sendReply(message.channel.id, "No movie found");
        }
        const embed = {
          type: 'rich',
          title: movie.title,
          description: movie.overview,
image: {
  url: `https://image.tmdb.org/t/p/original` + movie.poster_path,
},
          fields: [
            {
              name: "Url",
              value: `https://www.themoviedb.org/movie/${movie.id}`,
              inline: true,
            },
            {
              name: 'Release Date',
              value: movie.release_date,
              inline: true,
            },
            {
              name: 'Rating',
              value: movie.vote_average.toString(),
              inline: true,
            }
          ],
          footer: {
            text: "Made by nab138 | nabdev.tk || Powered by TMDb | https://www.themoviedb.org"
          },
          color: '0xad7f3e'
        }
        sendReply(message.channel.id, {embeds: [embed], components: []}, movie.title, movie.backdrop_path ? `https://image.tmdb.org/t/p/original` + movie.backdrop_path : null);
      }
    }

    this.commands.push(getMovieCommand);

    const getTVCommand: Command = {
      id: "tv-info-command",
      applicationId: EnmitySectionID,
    
      name: "tv-show",
      displayName: "tv-show",

      description: "Get info about a TV show",
      displayDescription: "Get info about a TV show",
    
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltIn,

      options: [{
        name: "show",
        displayName: "show",

        description: "Show to look up",
        displayDescription: "Show to look up",

        type: ApplicationCommandOptionType.String,
        required: true,
      }],

      execute: async function(args, message) {
        const movie = JSON.parse((await get(`https://api.themoviedb.org/3/search/tv?api_key=${api_key}&query=${encodeURI(args[0].value)}`)).text).results[0];
        if(!movie) {
          return sendReply(message.channel.id, "No Show found");
        }
        const embed = {
          type: 'rich',
          title: movie.name,
          description: movie.overview,
          image: {
            url: `https://image.tmdb.org/t/p/original` + movie.poster_path,
          },
          fields: [
            {
              name: "Url",
              value: `https://www.themoviedb.org/tv/${movie.id}`,
              inline: true,
            },
            {
              name: 'First aired',
              value: movie.first_air_date,
              inline: true,
            },
            {
              name: 'Rating',
              value: movie.vote_average.toString(),
              inline: true,
            }
          ],
          footer: {
            text: "Made by nab138 | nabdev.tk || Powered by TMDb | https://www.themoviedb.org"
          },
          color: '0xad7f3e'
        }
        sendReply(message.channel.id, {embeds: [embed], components: []}, movie.name, movie.backdrop_path ? `https://image.tmdb.org/t/p/original` + movie.backdrop_path : null);
      }
    }

    this.commands.push(getTVCommand);
  },

  onStop() {
    this.commands = [];
  }
}

registerPlugin(ExamplePlugin);
