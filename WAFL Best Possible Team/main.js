import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, 'players.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// const teamsFile = join(__dirname, 'possibleTeams.json')
// const adapter = new JSONFile(teamsFile)
// const db = new Low(new JSONFile(teamsFile))

// Read data from JSON file, this will set db.data content
await db.read()

//console.log(db.data);

const defenders = [];
const midfielders = [];
const forwards = [];
const rucks = [];

async function ProcessPlayersData(data){
    data.forEach((player)=>{
        ProcessPlayer(player);
    });
} 

async function ProcessPlayer(player){
    switch(player.position){
        case "Forward":
            forwards.push(player);
            break;
        case "Defender":
            defenders.push(player);
            break;
        case "Ruck":
            rucks.push(player);
            break;
        case "Midfielder":
            midfielders.push(player);
            break;
    }
}

//console.time("second")
//console.log(db.data.data[10]);
db.data.data.sort(function compare(a, b) {
    return b.lastRoundScore - a.lastRoundScore;
});
//console.log(db.data.data[10]);
await ProcessPlayersData(db.data.data);
//console.timeEnd("second")

// console.log("def", defenders.length);
// console.log("mid", midfielders.length);
// console.log("ruk", rucks.length);
// console.log("fwd", forwards.length);

const MAX_PRICE = 717100;

function HighestScorers(){
    const newDefenders = [];
    defenders.forEach((defender) => {
        const lastPrice = defender.lastPrice;
        const roundScore = defender.roundScore;       

        if(newDefenders.length < 6){
            newDefenders.push(defender);
            return;
        }

        const shouldAddDefender = false;

        for(let i=0; i < newDefenders.length; i++){
            if(newDefenders[i].lastPrice > lastPrice && 
                roundScore > newDefenders[i].roundScore) {
                    shouldAddDefender = true;
                    newDefenders.slice(i, 1);
                    break;
                }
        }

        if(shouldAddDefender){
            newDefenders.push(defender);
        }
    });

    console.log('newDefenders', newDefenders.length);
}

HighestScorers();