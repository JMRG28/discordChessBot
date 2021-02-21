require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();
const https = require('https');

///Functions

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
}
function errorEmbed(message) {
    const content = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle("Error: " + message)
        .attachFiles(['./src/ChessSet.jpg'])
        .setAuthor('ChessBot by Jean-Maurice Raboude', 'attachment://ChessSet.jpg', 'https://rabou.de')
        .setTimestamp()
        .setFooter('•', 'attachment://ChessSet.jpg');

    return content
}


///Custom Embeds
const usageEmbed = new Discord.MessageEmbed()
    .setColor('#0bbb11')
    .setTitle("Usage: !cb profile <nom_du_profil_lichess>")
    .attachFiles(['./src/ChessSet.jpg'])
    .setAuthor('ChessBot by Jean-Maurice Raboude', 'attachment://ChessSet.jpg', 'https://rabou.de')
    .setTimestamp()
    .setFooter('•', 'attachment://ChessSet.jpg');

const authorEmbed = new Discord.MessageEmbed()
    .setColor('#d4ce12')
    .setTitle("Author: Jean-Maurice Raboude")
    .attachFiles(['./src/ChessSet.jpg'])
    .setAuthor('ChessBot by Jean-Maurice Raboude', 'attachment://ChessSet.jpg', 'https://rabou.de')
    .setTimestamp()
    .setFooter('•', 'attachment://ChessSet.jpg');


///Bot Events

client.on('ready', () => {
    console.log(`${client.user.tag} is connected!`);
});

client.on('message', msg => {
    let content = msg.content;
    if (content.startsWith('!cb')) {
        if (content.includes('profile')) {
            tab = content.split(' ');
            for (let i = 1; i < tab.length; i++) {
                if (tab[i] == 'profile') {
                    let user = tab[i + 1]
                    console.log(`user = ${user}`)
                    if (user) {
                        https.get('https://lichess.org/api/user/' + user, (resp) => {
                            let data = '';
                            resp.on('data', (chunk) => {
                                data += chunk;
                            });
                            resp.on('end', () => {
                                if (data) {
                                    let info = JSON.parse(data);
                                    let username = info.username;
                                    let cl_rating = info.perfs['classical']['rating']
                                    let bl_rating = info.perfs['blitz']['rating']
                                    let pz_rating = info.perfs['puzzle']['rating']
                                    let bu_rating = info.perfs['bullet']['rating']
                                    let rp_rating = info.perfs['rapid']['rating']
                                    let ratingsTitles = ['classical', 'blitz', 'puzzle', 'bullet', 'rapid']
                                    let ratingsTable = []
                                    for (let r of ratingsTitles) {
                                        let current = info.perfs[r]
                                        if (current) {
                                            ratingsTable.push(r.capitalize() + ' : ' + current['rating'])
                                        }
                                    }
                                    ratingsTable.sort(function (a, b) {
                                        let a_value = parseInt(a.split(' : ')[1])
                                        let b_value = parseInt(b.split(' : ')[1])
                                        return b_value - a_value
                                    });
                                    let ratingsString = ''
                                    for (let w of ratingsTable) {
                                        ratingsString += w + '\n'
                                    }

                                    let played = info.count['all']
                                    let wins = info.count['win']
                                    let losses = info.count['loss']
                                    let draws = info.count['draw']
                                    let playTime = (parseInt(info.playTime['total']) / 3600).toFixed(2)

                                    const profileEmbed = new Discord.MessageEmbed()
                                        .setColor('#0099ff')
                                        .setTitle(username + "'s Lichess Profile:")
                                        .attachFiles(['./src/ChessSet.jpg'])
                                        .setURL('https://lichess.org/@/' + username)
                                        .setAuthor('ChessBot by Jean-Maurice Raboude', 'attachment://ChessSet.jpg', 'https://rabou.de')

                                        .addFields(
                                            { name: 'Ratings: ', value: ratingsString },
                                            { name: 'Stats: ', value: "Played: " + played + "\nWins: " + wins + "\nLosses: " + losses + "\nDraws: " + draws + "\nPlay Time: " + playTime + " hours" },
                                        )
                                        .setTimestamp()
                                        .setFooter('•', 'attachment://ChessSet.jpg');
                                    msg.channel.send(profileEmbed)

                                }
                                else {
                                    msg.channel.send(errorEmbed("User not found !"))
                                }

                            });

                        }).on("error", (err) => {
                            console.log("Error: " + err.message);
                        });
                    }
                }
            }
        } else if (content.includes('help')) {
            msg.channel.send(usageEmbed)
        } else if (content.includes('author')) {
            msg.channel.send(authorEmbed)
            msg.channel.send("Here he is: <@367722006655008778>")
        } else {
            msg.channel.send(errorEmbed("Command not found !"))
            msg.channel.send(usageEmbed)
        }

    }
});

///Bot connection

client.login(process.env.TOKEN);