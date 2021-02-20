require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();
const https = require('https');
client.on('ready', () => {
    console.log(`${client.user.tag} is connected!`);    
});



client.on('message', msg => {
    let content = msg.content;
    if (content.startsWith('!cb')) {
        if (content.includes('profile')) {
            tab = content.split(' ');
            for (let i=1;i<tab.length;i++) {
                if (tab[i] == 'profile') {
                    let user = tab[i + 1]
                    console.log(`user = ${user}`)
                    if (user) {
                        https.get('https://lichess.org/api/user/'+user, (resp) => {
                            let data = '';
                            resp.on('data', (chunk) => {
                                data += chunk;
                            });
                            resp.on('end', () => {
                                if(data){
                                let info = JSON.parse(data);
                                let username = info.username;
                                let cl_rating = info.perfs['classical']['rating']
                                let bl_rating = info.perfs['blitz']['rating']
                                let pz_rating = info.perfs['puzzle']['rating']
                                let bu_rating = info.perfs['bullet']['rating']
                                let rp_rating = info.perfs['rapid']['rating']
                                let played = info.count['all']
                                let wins = info.count['win']
                                let losses = info.count['loss']
                                let draws = info.count['draw']
                                msg.channel.send("__**"+username+" Profile Details : **__")
                                msg.channel.send("__Ratings:__")
                                msg.channel.send("```Classical : "+cl_rating+"\nBlitz : "+bl_rating+"\nPuzzle : "+pz_rating+"\nBullet : "+bu_rating+"\nRapid : "+rp_rating+"```")
                                msg.channel.send("__Stats:__")
                                msg.channel.send("```Played: "+played+"\nWins: "+wins+"\nLosses: "+losses+"\nDraws: "+draws+"```")
                                }
                                else{
                                    msg.channel.send("```css\n[User "+user+" not found!]\n```")
                                }

                            });

                        }).on("error", (err) => {
                            console.log("Error: " + err.message);
                        });
                    }
                }
            }
        }else if (content.includes('help')) {
            msg.channel.send("```ini\n[Usage: !cb profile <nom_du_profil_lichess>]\n```")
        }else if (content.includes('author')) {
            msg.channel.send("```diff\n+Bot created by Jean-Maurice Raboude\n```")
            msg.channel.send("Here he is: <@367722006655008778>")
        }else{
            msg.channel.send("```css\n[Command not found]\n```")
            msg.channel.send("```ini\n[Usage: !cb profile <nom_du_profil_lichess>]\n```")
        }

    }
});
client.login(process.env.TOKEN);