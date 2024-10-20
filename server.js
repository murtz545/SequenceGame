const fs = require(`fs`);
const http = require(`http`);
const WebSocket = require(`ws`); // npm i ws

const board = [
  [
    "card back",
    "card rank-2 spades",
    "card rank-3 spades",
    "card rank-4 spades",
    "card rank-5 spades",
    "card rank-10 diams",
    "card rank-q diams",
    "card rank-k diams",
    "card rank-a diams",
    "card back",
  ],

  [
    "card rank-6 clubs",
    "card rank-5 clubs",
    "card rank-4 clubs",
    "card rank-3 clubs",
    "card rank-2 clubs",
    "card rank-4 spades",
    "card rank-5 spades",
    "card rank-6 spades",
    "card rank-7 spades",
    "card rank-a clubs",
  ],

  [
    "card rank-7 clubs",
    "card rank-a spades",
    "card rank-2 diams",
    "card rank-3 diams",
    "card rank-4 diams",
    "card rank-k clubs",
    "card rank-q clubs",
    "card rank-10 clubs",
    "card rank-8 spades",
    "card rank-k clubs",
  ],

  [
    "card rank-8 clubs",
    "card rank-k spades",
    "card rank-6 clubs",
    "card rank-5 clubs",
    "card rank-4 clubs",
    "card rank-9 hearts",
    "card rank-8 hearts",
    "card rank-9 clubs",
    "card rank-9 spades",
    "card rank-6 spades",
  ],

  [
    "card rank-9 clubs",
    "card rank-q spades",
    "card rank-7 clubs",
    "card rank-6 hearts",
    "card rank-5 hearts",
    "card rank-2 hearts",
    "card rank-7 hearts",
    "card rank-8 clubs",
    "card rank-10 spades",
    "card rank-10 clubs",
  ],

  [
    "card rank-a spades",
    "card rank-7 hearts",
    "card rank-9 diams",
    "card rank-a hearts",
    "card rank-4 hearts",
    "card rank-3 hearts",
    "card rank-k hearts",
    "card rank-10 diams",
    "card rank-6 hearts",
    "card rank-2 diams",
  ],

  [
    "card rank-k spades",
    "card rank-8 hearts",
    "card rank-8 diams",
    "card rank-2 clubs",
    "card rank-3 clubs",
    "card rank-10 hearts",
    "card rank-q hearts",
    "card rank-q diams",
    "card rank-5 hearts",
    "card rank-3 diams",
  ],

  [
    "card rank-q spades",
    "card rank-9 hearts",
    "card rank-7 diams",
    "card rank-6 diams",
    "card rank-5 diams",
    "card rank-a clubs",
    "card rank-a diams",
    "card rank-k diams",
    "card rank-4 hearts",
    "card rank-4 diams",
  ],

  [
    "card rank-10 spades",
    "card rank-10 hearts",
    "card rank-q hearts",
    "card rank-k hearts",
    "card rank-a hearts",
    "card rank-3 spades",
    "card rank-2 spades",
    "card rank-2 hearts",
    "card rank-3 hearts",
    "card rank-5 diams",
  ],

  [
    "card back",
    "card rank-9 spades",
    "card rank-8 spades",
    "card rank-7 spades",
    "card rank-6 spades",
    "card rank-9 diams",
    "card rank-8 diams",
    "card rank-7 diams",
    "card rank-6 diams",
    "card back",
  ],
];

const positionBoard = [
  ["-", "green", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "green", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "green", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "green", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "green", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
];


const deck = [
  "card rank-a spades",
  "card rank-2 spades",
  "card rank-3 spades",
  "card rank-4 spades",
  "card rank-5 spades",
  "card rank-6 spades",
  "card rank-7 spades",
  "card rank-8 spades",
  "card rank-9 spades",
  "card rank-10 spades",
  "card rank-j spades",
  "card rank-q spades",
  "card rank-k spades",
  "card rank-a clubs",
  "card rank-2 clubs",
  "card rank-3 clubs",
  "card rank-4 clubs",
  "card rank-5 clubs",
  "card rank-6 clubs",
  "card rank-7 clubs",
  "card rank-8 clubs",
  "card rank-9 clubs",
  "card rank-10 clubs",
  "card rank-j clubs",
  "card rank-q clubs",
  "card rank-k clubs",
  "card rank-a diams",
  "card rank-2 diams",
  "card rank-3 diams",
  "card rank-4 diams",
  "card rank-5 diams",
  "card rank-6 diams",
  "card rank-7 diams",
  "card rank-8 diams",
  "card rank-9 diams",
  "card rank-10 diams",
  "card rank-j diams",
  "card rank-q diams",
  "card rank-k diams",
  "card rank-a hearts",
  "card rank-2 hearts",
  "card rank-3 hearts",
  "card rank-4 hearts",
  "card rank-5 hearts",
  "card rank-6 hearts",
  "card rank-7 hearts",
  "card rank-8 hearts",
  "card rank-9 hearts",
  "card rank-10 hearts",
  "card rank-j hearts",
  "card rank-q hearts",
  "card rank-k hearts",
];

const divideDeckIntoPieces = (deck) => {
  let shuffled = deck
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  const result = new Array(Math.ceil(shuffled.length / 6))
    .fill()
    .map((_) => shuffled.splice(0, 6));
  // console.log(result);
  return result;
};

// code to read file
const readFile = (fileName) =>
  new Promise((resolve, reject) => {
    fs.readFile(fileName, `utf-8`, (readErr, fileContents) => {
      if (readErr) {
        reject(readErr);
      } else {
        resolve(fileContents);
      }
    });
  });

// code to create a server
const server = http.createServer(async (req, resp) => {
  console.log(`browser asked for ${req.url}`);
  if (req.url == `/mydoc`) {
    const clientHtml = await readFile(`client.html`);
    resp.end(clientHtml);
  } else if (req.url == `/myjs`) {
    const clientJs = await readFile(`client.js`);
    resp.end(clientJs);
  } else if (req.url == `/sequence.css`) {
    const sequenceCss = await readFile(`sequence.css`);
    resp.end(sequenceCss);
  } else {
    resp.end(`not found`);
  }
});

// to listen for clients
server.listen(8000);


let numUsers = 0;
let newCl = 1;
// creating a web socket
const wss = new WebSocket.Server({port:8080});


const users = new Map();

function deckAgain() {
  for(let client of users.keys()) {
    let getInf = users.get(client);
    let arrSz = getInf["UseDeck"];
    if(arrSz.length>=1) {
      return false;
    }
  }
  return true;
}

function fetchBoard(rows, cols, arr) {
  let i=rows;
  let fiveBoard = [];
  while(i < rows+5) {
    let slc =arr[i].slice(cols, cols+5);
    fiveBoard.push(slc)
    i=i+1;
  }
  return fiveBoard;
}

function boardFive(arr) {
  let i=0;
  while(i<arr.length) {
      let rows = true;
      let oneDiag = true;
      let pos = 4;
      let twoDiag = true;
      let cols = true;
      for(let j=0; j<arr.length-1; j++) {
        if(arr[i][j] != arr[i][j+1]) {
          rows=false;
        }
        else if(arr[i][j] === "-")
        {
          rows=false;
        }
        if(arr[j][i] === "-") {
          cols = false;
        }
        else if(arr[j][i] != arr[j+1][i])
        {
          cols = false;
        }
      }
      if(rows) {
        return true;
      }
      else if(cols) {
        return true;
      }
      for(let i=0; i<arr.length-1; i++) {
          if(arr[i][i] === "-") {
            oneDiag=false;
          }
          else if (arr[i][i] != arr[i+1][i+1]) {
            oneDiag=false;
          }
          if(arr[i][pos] != arr[i+1][pos-1]) {
            twoDiag = false;
          }
          else if(arr[i][pos] === "-") {
            twoDiag = false;
          }
          pos = pos - 1;
      }
      if(oneDiag) {
          return true;
      }
      else if(twoDiag) {
        return true;
      }
  
    i=i+1;
  }
  return false;

}

function winFn(arr) {
  for(let i=0; i<6; i++) {
    let j=0;
    while(j<6) {
        let brd = fetchBoard(i,j,arr);
        let chkVar = boardFive(brd);
        if(chkVar) {
            return true;
        }
        j=j+1;
      }
  }
  return false;
}
function deckAgFn(dckInf, k, positionBoard, newCl) {
  
  k.send(JSON.stringify({
    type: "seconddeck",
    positionBoard,
    isTurn: dckInf["UseId"] === newCl ? true : false,
    newCl,
    newdeck: dckInf["UseDeck"],
    
  }))
}

decks = divideDeckIntoPieces(deck);
let anotherDck = false;

function gamefullFn(ws){
  ws.send(JSON.stringify({
    type: "gamefull",
    addMessage : "Gamefull! No more players can join."
  }))
}
function nextPlayer(client, users, newCl)
{
  let getInf = users.get(client);
  let addMessage = "Current Player " + getInf["UseId"];
  if (getInf["UseId"] === newCl ? true : false)
  {
    let str = ", Your turn."
    addMessage = addMessage + str;
  }
  else
  {
    let str2 = " player's turn.";
    addMessage = addMessage + ", " + newCl + str2;
  }
  return addMessage;
}
function endgameFn(tmp, stri)
{
  tmp.send(JSON.stringify({
    type: "endgame",
    positionBoard,
    addMessage : stri
  }))
}
function newBoardFn(client, newCl, getInf, addMessage)
{
  client.send(JSON.stringify({
        type: 'newboard',
        board,
        newdeck: getInf["UseDeck"],
        color: getInf["UseColor"],
        positionBoard,
        addMessage,
        newCl,
        isTurn: getInf["UseId"] === newCl ? true : false,
      }))
}
function drawFn(users, positionBoard) {
  for(let client of users.keys()) {
    client.send(JSON.stringify({
      type: "draw",
      positionBoard,
      addMessage : "Game Has Drawn!!!"
    }))
  } 
}
function clickFn(client, positionBoard, newCl, getInf, addMessage) {
  client.send(JSON.stringify({
    type: "click",
    newdeck: getInf["UseDeck"],
    isTurn: getInf["UseId"] === newCl ? true : false,
    positionBoard,
    newCl,
    addMessage
  }))
}
function waitingFn(client, getInf, numUsers)
{
  client.send(JSON.stringify({
    type: "waiting",
    color: getInf["UseColor"],
    addMessage : "Please wait until we have 4 players. Right now " + (numUsers) + " players are online.",
}))
}
wss.on("connection", (ws) => {

  if (numUsers == 4) {
    gamefullFn(ws);
    return
  }
  
  numUsers = numUsers + 1;
  let color = "green";
  let ID = numUsers;
  if(ID===1)
  {
    color="green";
  }
  else if(ID===3)
  {
    color="green";
  }
  if(ID===2)
  {
    color="blue"
  }
  else if(ID===4)
  {
    color="blue"
  }

  let cnst = 1;
  let UseInf = {"UseId" : ID, "UseColor":color, "UseDeck" : decks[ID-1]};
  users.set(ws, UseInf);

    ws.on('message', (msg) => {
    const message = JSON.parse(msg)
    if (message.type == "click") {
      let mod = newCl%4;
      newCl = mod+1;
      let getInf = users.get(ws);
      UseInf = {"UseId" : getInf["UseId"], "UseColor":getInf["UseColor"], "UseDeck" : message.newer};
      users.set(ws, UseInf);
      let newCol = message.color;
      positionBoard[message.columnnumber][message.index] = newCol;


      if (winFn(positionBoard)) {
        for(let c of users.keys()) {
          let dckInf = users.get(c);
          let decr = (newCl - 1) % 4;
          let incr = (newCl + 1) % 4;
          if(dckInf["UseId"] === decr) {
            let stri = "Yay, Your Team Won."
            endgameFn(c, stri);
          }
          else if(dckInf["UseId"] === incr)
          {
            let stri = "Yay, Your Team Won."
            endgameFn(c, stri);
          }
          else {
            let stri= "Your Team Lost. Better Luck Next Time.";
            endgameFn(c, stri);
          }
        }
      }

      else if(anotherDck === true) {
        if(deckAgain()) {
          console.log("In Draw " + anotherDck === false + " " + deckAgain())
          console.log("In Draw")
          drawFn(users, positionBoard);
        }
    }

    else if(anotherDck === false) {
      if(deckAgain()) {
      console.log("In Second Deck " + anotherDck === false + " " + deckAgain())
      anotherDck = true
      console.log("In Second Deck")
      for(let k of users.keys()) {
        
        let dckInf = users.get(k);
        dckInf = {"UseId" : dckInf["UseId"], "UseColor":dckInf["UseColor"], "UseDeck" : decks[dckInf["UseId"]+3]};
        users.set(k, dckInf);
        deckAgFn(dckInf, k, positionBoard, newCl);
      }
    }
    else {

      for(let client of users.keys()) {
        let getInf = users.get(client);

        let addMessage = nextPlayer(client, users, newCl);
        clickFn(client, positionBoard, newCl, getInf, addMessage);
      }

    }
    }
  }
  })

  if(numUsers < 4) {
    for(let client of users.keys()) {
      let getInf = users.get(client);
      waitingFn(client, getInf, numUsers);
      }
  }
  else if (numUsers === 4) {
    for(let client of users.keys()) {
      
  
      let msg = nextPlayer(client, users, newCl);
      let getInf = users.get(client);
      newBoardFn(client, newCl, getInf, msg);
    }
    
  }
});