const express = require("express");
const app = express()
 // Función principal
function main() {
  console.log("El script se está ejecutando...");
  // Aquí puedes poner el código que quieres que se ejecute cada 5 minutos
}

// Ejecución principal del script
main();

// Ejecutar la función principal cada 5 minutos (300000 milisegundos)
const intervalId = setInterval(() => {
  console.log("El script se está ejecutando nuevamente...");
  main();
}, 300000); // 300000 milisegundos = 5 minutos

// Detener el script después de 5 minutos
setTimeout(() => {
  console.log("El script se va a detener ahora.");
  clearInterval(intervalId); // Detener el intervalo
  process.exit(0); // Finalizar el script
}, 300000); // 300000 milisegundos = 5 minutos

app.get('/', (req, res) => {
  res.send("uptime robot")
})
 
app.listen(3000, () => {
  console.log("Setting up bot lobbies v3")
})

const handleCommand = (message, sender) => {
        console.log(`${sender.displayName}: ${message.content}`);
        const [command, ...args] = message.content.slice(1).split(' ').map(arg => arg.toLowerCase());
        const content = args.join(' ');

        if (command === 'c') {
            client.party.me.setEmote("EID_AshtonSaltLake", "ssz/Content/Athena/Items/Cosmetics/Dances/EID_AshtonSaltLake");
            message.reply(`Crashed.`);
        }
    };



const url = require('url')
const fs = require('fs');
const axios = require('axios').default;
var os = require('os');
const { Client, ClientOptions, Enums, Party } = require('fnbr');
const Websocket = require('ws');
var HttpsProxyAgent = require('https-proxy-agent');
const { allowedPlaylists, websocketHeaders } = require('./utils/constants');
const xmlparser = require('xml-parser');
require('colors');

const bLog = true;
const GetVersion = require('./utils/version');

/**
 * @typedef {import('./utils/types').MMSTicket} MMSTicket
 * @typedef {import('./utils/types').PartyMatchmakingInfo} PartyMatchmakingInfo
 */

// based on ollie's fortnitejs bot

(async () => {
  const lastest = await GetVersion();
  const Platform = os.platform() === "win32" ? "Windows" : os.platform();
  const UserAgent = `Fortnite/${lastest.replace('-Windows', '')} ${Platform}/${os.release()}`

  axios.defaults.headers["user-agent"] = UserAgent;
  console.log("UserAgent set to", axios.defaults.headers["user-agent"]);

  /**
   * @type {ClientOptions}
   */
  const clientOptions = {
    defaultStatus: "Launching MM Client...",
    auth: {},
    debug: console.log,
    xmppDebug: false,
    platform: 'WIN',
    partyConfig: {
      chatEnabled: true,
      maxSize: 4
    }
  };
  
  try {
    clientOptions.auth.deviceAuth = JSON.parse(fs.readFileSync('./deviceAuth.json'));
  } catch (e) {
    clientOptions.auth.authorizationCode = async () => Client.consoleQuestion('Please enter an authorization code: ');
  }

  const client = new Client(clientOptions);
  client.on('deviceauth:created', (deviceauth) => fs.writeFileSync('./deviceAuth.json', JSON.stringify(deviceauth, null, 2)));

  await client.login();
  console.log(`[LOGS] Logged in as ${client.user.displayName}`);
  party = client.party
  
  client.setStatus(`iron web MM bot | Bot Lobbys 🤖| Invite ✔️`)
  await client.party.me.setOutfit("CID_028_Athena_Commando_F");
  await client.party.me.setLevel('99')
  client.party.setPrivacy(Enums.PartyPrivacy.PUBLIC);
  await client.party.me.setBanner('InfluencerBanner38')
  
  axios.interceptors.response.use(undefined, function (error) {
    if (error.response) {

      if (error.response.data.errorCode && client && client.party) {
        client.party.sendMessage(`HTTP Error: ${error.response.status} ${error.response.data.errorCode} ${error.response.data.errorMessage}`)
      }

      console.error(error.response.status, error.response.data)
    }

    return error;
  });

  client.on('deviceauth:created', (da) => writeFile('./deviceAuth.json', JSON.stringify(da, null, 2)));

  var bIsMatchmaking = false;

  client.on('party:updated', async (updated) => {

    switch (updated.meta.schema["Default:PartyState_s"]) {
      case "BattleRoyalePreloading": {

        var loadout = client.party.me.meta.set("Default:LobbyState_j",
          {
            "LobbyState": {
              "hasPreloadedAthena": true
            }
          }
        );

        await client.party.me.sendPatch({
          'Default:LobbyState_j': loadout,
        });

        break;
      }

      case "BattleRoyaleMatchmaking": {
        if (bIsMatchmaking) {
          return;
        }
        bIsMatchmaking = true;
        if (bLog) { console.log(`[${'Matchmaking'.cyan}]`, 'Matchmaking Started') }

        /**
         * @type {PartyMatchmakingInfo}
         */
        const PartyMatchmakingInfo = JSON.parse(updated.meta.schema["Default:PartyMatchmakingInfo_j"]).PartyMatchmakingInfo;


        const playlistId = PartyMatchmakingInfo.playlistName.toLocaleLowerCase();

        if (!allowedPlaylists.includes(playlistId)) {
          console.log("Unsupported playlist", playlistId)
          client.party.me.setReadiness(false);
          return;
        }

        var partyPlayerIds = client.party.members.filter(x => x.isReady).map(x => x.id).join(',')

        const bucketId = `${PartyMatchmakingInfo.buildId}:${PartyMatchmakingInfo.playlistRevision}:${PartyMatchmakingInfo.regionId}:${playlistId}`

        // auth.missing_player_id

        console.log(partyPlayerIds)

        var query = new URLSearchParams();
        query.append("partyPlayerIds", partyPlayerIds);
        query.append("player.platform", "Windows");
        query.append("player.option.partyId", client.party.id);
        query.append("input.KBM", "true");
        query.append("player.input", "KBM");
        query.append("bucketId", bucketId);

        client.party.members.filter(x => x.isReady).forEach(Member => {
          const platform = Member.meta.get("Default:PlatformData_j");
          const PlatformName = platform.PlatformData.platform.platformDescription.name;

          if (!query.has(`party.${PlatformName}`)) {
            query.append(`party.${PlatformName}`, "true")
          }
        });
const logg = client.auth.auths.get("fortnite");
              
        const token = client.auth.auths.get("fortnite").token;
        const id = client.auth.auths.get("fortnite").accountid;

        const TicketRequest = (
                
            await axios.get(
              `https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/game/v2/matchmakingservice/ticket/player/fccea2eb2be346cb9ce4518dd4d2faf2?${query}`,
              {
                headers: {
                  Accept: 'application/json',
                  Authorization: `Bearer ${token}`
                }
              }
            )
          );
console.log(`${client.auth.auths.get("fortnite")}`)
          console.log("TICKET REQUEST: " + TicketRequest)

          if (TicketRequest.status !== 200) {
            console.log(`
\`\`\`diff
- [${'Matchmaking'}], Error while obtaining ticket\`\`\``);
            client.party.me.setReadiness(false);
            return console.log(TicketRequest);
          }

          /**
           * @type {MMSTicket}
           */
          const ticket = TicketRequest.data;

          /**
           * @type {String}
           */
          const HashRequest = (
            await axios.post(
              // "https://plebs.polynite.net/api/checksum",
              "https://api.waferbot.com/checksum",
              ticket,
              {
                Accept: 'application/json'
              }
            )
          );

          if (TicketRequest.status !== 200) {
            console.log(`
\`\`\`diff
- [${'Matchmaking'}], Error getting hash\`\`\``);
            client.party.me.setReadiness(false);
            return;
          }

        console.log(HashRequest)

        const hash = HashRequest.data;

        var MMSAuth = [
          "Epic-Signed",
          ticket.ticketType,
          ticket.payload,
          ticket.signature,
          hash
        ];

        const matchmakingClient = new Websocket(
          ticket.serviceUrl,
          {
            perMessageDeflate: false,
            rejectUnauthorized: false,
            headers: {
              Origin: ticket.serviceUrl.replace('ws', 'http'),
              Authorization: MMSAuth.join(" "),
              ...websocketHeaders
            }
          }
        );

        matchmakingClient.on('unexpected-response', (request, response) => {
          let data = '';
          response.on('data', (chunk) => data += chunk);

          response.on('end', () => {
            const baseMessage = `[${'Matchmaking'.cyan}]` + ' Error'.red + ` Error while connecting to matchmaking service: (status ${response.statusCode} ${response.statusMessage})`;

            client.party.chat.send(`Error while connecting to matchmaking service: (status ${response.statusCode} ${response.statusMessage})`)

            if (data == '') {
              console.error(baseMessage);
            }

            else if (response.headers['content-type'].startsWith('application/json')) {

              const jsonData = JSON.parse(data);

              if (jsonData.errorCode) {

                console.error(`${baseMessage}, ${jsonData.errorCode} ${jsonData.errorMessage || ''}`);
                client.party.chat.send(`Error while connecting to matchmaking service: ${jsonData.errorCode} ${jsonData.errorMessage || ''}`)

              } else {
                console.error(`${baseMessage} response body: ${data}`)
              }

            }

            else if (response.headers['x-epic-error-name']) {

              console.error(`${baseMessage}, ${response.headers['x-epic-error-name']} response body: ${data}`);

            }

            else if (response.headers['content-type'].startsWith('text/html')) {
              const parsed = xmlparser(data);

              if (parsed.root) {

                try {

                  const title = parsed.root.children.find(x => x.name == 'head').children.find(x => x.name == 'title');

                  console.error(`${baseMessage} HTML title: ${title}`)

                } catch { console.error(`${baseMessage} HTML response body: ${data}`) }

              }

              else { console.error(`${baseMessage} HTML response body: ${data}`) }
            }

            else { console.error(`${baseMessage} response body: ${data}`) }
          })
        })

        if (bLog) {
          matchmakingClient.on('close', function () {
            console.log(`[${'Matchmaking'.cyan}]`, 'Connection to the matchmaker closed')
          });
        }

        matchmakingClient.on('message', (msg) => {
          const message = JSON.parse(msg);
          if (bLog) {
            console.log(`[${'Matchmaking'.cyan}]`, 'Message from the matchmaker', message)
          }

          if (message.name === 'Error') {
            bIsMatchmaking = false;
          }
        });

        break;
      }

      case "BattleRoyalePostMatchmaking": {
        if (bLog) { console.log(`[${'Party'.magenta}]`, 'Players are enterinh the match, leaving the party') }
        bIsMatchmaking = false;
        client.party.leave();
        break;
      }

      case "BattleRoyaleView": {
        break;
      }

      default: {
        if (bLog) { console.log(`[${'Party'.magenta}]`, 'Unknow PartyState'.yellow, updated.meta.schema["Default:PartyState_s"]) }
        break;
      }
    }
  })

  client.on("party:member:updated", async (Member) => {
    if (Member.id == client.user.id) {
      return;
    }


    if (!client.party.me) {
      return;
    }

    if ((Member.isReady && (client?.party?.me?.isLeader || Member.isLeader) && !client.party?.me?.isReady) && !client.party.bManualReady) {
      // Ready Up
      if (client.party?.me?.isLeader) {
        await Member.promote();
      }

      client.party.me.setReadiness(true);
    }
    else if ((!Member.isReady && Member.isLeader) && !client.party.bManualReady) {
      try {
        client.WSS.close()
      } catch { }
      client.party.me.setReadiness(false);
    }


    var bAllmembersReady = true;

    client.party.members.forEach(member => {
      if (!bAllmembersReady) {
        return;
      }

      bAllmembersReady = member.isReady;
    });

  })


  client.on('friend:request', async (request) => {
    console.log(`[${'client'.yellow}]`, `Recived a friend request ${request.displayName} ${request.id}`)

        await request.accept();
    console.log(`[${'client'.yellow}]`, `Accept a friend request ${request.displayName} ${request.id}`)
    }
   )
  
  client.on('party:invite', async (request) => {
    party = client.party
    if ([1] == party.size) {
      await request.accept();
    }
    else {
      await request.decline()
    }
  }
  );

  client.on('party:member:joined', async (join) => {
    client.party.me.sendPatch({'Default:AthenaCosmeticLoadout_j': '{"AthenaCosmeticLoadout":{"cosmeticStats":[{"statName":"TotalVictoryCrowns","statValue":0},{"statName":"TotalRoyalRoyales","statValue":669},{"statName":"HasCrown","statValue":0}]}}',})
    await client.party.me.setOutfit("CID_083_Athena_Commando_F_Tactical");
    client.party.me.setEmote('EID_Coronet');

    party = client.party

    if ([2] == party.size) {
      client.party.chat.send('Hey, Join the discord server: dsc.gg/pulsarfn\n if u want more infomation about status')
      client.setStatus(`WAIT ${party.size} / ${party.maxSize} SOMEONE USE THE BOT !`)
    }
    if ([3] == party.size) {
      client.party.chat.send('Hey, Join the discord server: dsc.gg/pulsarfn\n if u want more infomation about status')
      client.setStatus(`WAIT ${party.size} / ${party.maxSize} SOMEONE USE THE BOT !`)
    }
    if ([4] == party.size) {
      client.party.chat.send('Hey, Join the discord server: dsc.gg/pulsarfn\n if u want more infomation about status')
      client.setStatus(`WAIT ${party.size} / ${party.maxSize} SOMEONE USE THE BOT !`)
    }
    if ([1] == party.size) {
      client.setStatus(`Bot lobbys bot By iron web10 1/16`)
        await client.party.setPrivacy(Enums.PartyPrivacy.PRIVATE);
        client.party.me.setReadiness(false);
    }
  })

  client.on('party:member:left', async (left) => {
    console.log(`Player ${left.displayName} has left the party`)
    
    if ([2] == party.size) {
      client.party.chat.send('Hey, Join the discord server: dsc.gg/pulsarfn\n if u want more infomation about status')
      client.setStatus(`WAIT ${party.size} / ${party.maxSize} SOMEONE USE THE BOT !`)
    }
    if ([3] == party.size) {
      client.party.chat.send('Hey, Join the discord server: dsc.gg/pulsarfn\n if u want more infomation about status')
      client.setStatus(`WAIT ${party.size} / ${party.maxSize} SOMEONE USE THE BOT !`)
    }
    if ([4] == party.size) {
      client.party.chat.send('Hey, Join the discord server: dsc.gg/pulsarfn\n if u want more infomation about status')
      client.setStatus(`WAIT ${party.size} / ${party.maxSize} SOMEONE USE THE BOT !`)
    }
    if ([1] == party.size) {
      client.setStatus(`Bot lobbys bot By iron web10 1/16`)
            await client.party.setPrivacy(Enums.PartyPrivacy.PRIVATE);
        client.party.me.setReadiness(false);
    }
  })

})();


