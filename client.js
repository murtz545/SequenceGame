const ws = new WebSocket(`ws://localhost:8080`);


function getType(ele) {
  const spl = ele.split(" ");
  // const typ = spl[2]; // spades, diam,...
  // const rank = spl[1].split("-");
  // const num = rank[1];
  return spl[2];
}

function getRank(ele) {
  const spl = ele.split(" ");
  const rank = spl[1].split("-");
  return rank[1];
}

const Sequence = () => {
  const [board, setBoard] = React.useState([[]]);
  
  let chk = true;
  const [positionBoard, setPositionBoard] = React.useState([[]]);
  

  const [cards, setCards] = React.useState([]);
  
  let diamondSign = "♦";
  let heartSign = "♥";
  const [myTurn, setmyTurn] = React.useState(false);
  
  const [turn, setTurn] = React.useState(0);
  const [addMessage, setAddMessage] = React.useState("");
  
  let spadesSign = "♠";
  let clubsSign = "♣";

  const [color, setColor] = React.useState("");
  
  const [gameEnd, setgameEnd] = React.useState(false);

  


  ws.onmessage = (event) => {

    const message = JSON.parse(event.data)
    if (message.type==="click"){
      setPositionBoard(message.positionBoard)
      setTurn(message.next)
      if(chk) {
        setCards(message.newdeck)
        setmyTurn(message.isTurn)
        setAddMessage(message.addMessage)
      }
      else
      {
        setColor(message.color)
        setgameEnd(true)
      }
    }
    else if (message.type==="seconddeck"){
      setPositionBoard(message.positionBoard)
      setCards(message.newdeck)
      if(chk) {
        setTurn(message.next)
        setmyTurn(message.isTurn)
      }
      else
      {
        setgameEnd(true)
      }
    }
    else if (message.type==="endgame"){
      setPositionBoard(message.positionBoard)
      setAddMessage(message.addMessage)
      if(chk) {
        setgameEnd(true)
      }
    }
    else if (message.type==="newboard"){
      setBoard(message.board)
      setPositionBoard(message.positionBoard)
      setColor(message.color)
      if(chk) {
        setTurn(message.next)
        setCards(message.newdeck)
        setmyTurn(message.isTurn)
        setAddMessage(message.addMessage)
      }
      else
      {
        setgameEnd(true)
      }
    }
    else if (message.type==="waiting"){  
      setColor(message.color)
      setAddMessage(message.addMessage)
    }
    else if (message.type==="draw"){
      setPositionBoard(message.positionBoard)
      setAddMessage(message.addMessage)
      if(!chk)
      {
        setBoard(message.board) 
      }
      else
      {
        setgameEnd(true)
      }
      
    }
    else if (message.type==="gamefull"){
      setAddMessage(message.addMessage)
    }
  }

  function getJack() {
    for(let i=0;i<cards.length;i++)
    {
      if(getRank(cards[i]) === "j")
      {
        return i;
      }
    }
    return -1;
    
  }

  function checkForIndex(boardCard, place)
  {
      const indexOfCards = cards.indexOf(boardCard);
      let newer = cards
      if (indexOfCards > -1) {
        newer.splice(indexOfCards, 1);
      }
      else {
        newer.splice(place, 1);
      }
      return newer;
  }

  function toServer(columnnumber, index) {
    if(gameEnd) {
      // // chk = false;
      setAddMessage("Game Ends")
      return
    }
    if(myTurn === false) {
      setAddMessage("Not your turn.")
      return
    }

    let place = getJack();
    // console.log('Place', place);
    let boardCard = board[columnnumber][index];
    
    if(cards.includes(boardCard) || place != -1) {
    let newer = checkForIndex(boardCard, place);
      

      setCards(newer);
       if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
        type:"click",
        columnnumber,
        index,
        color,
        newer,
      }))
      }
    }
    else
    {
      setAddMessage("Invalid Click")
    }
  }


  return (
    <div>
      <div className="container">
        {
          board.map((column, colno) => (
            
            <div>
                 {console.log("colno =",colno)}
              <div className="playingCards fourColours rotateHand">
                    <ul className="table">
                      {
              
                        column.map((ele, i) => {
                          // console.log("cilno ",column)

                          if(positionBoard.length>=2)
                          {
                            let crd = positionBoard[colno][i];
                            if(crd !== '-') {
                            return (
                              <div onClick={() => 
                              toServer(colno, i)}>
                                <li>
                                  <div className="card"><div className={crd}></div></div>
                                </li>
                              </div>
                            )
                            }
                          }
                          // console.log(ele)
                          if(ele == "card back")
                          {
                            return (
                              <div>
                                <li>
                                  <div className="card back"><span className="rank"></span></div>
                                </li>
                              </div>);
                          }
                          else if(getType(ele) == "spades")
                          {
                            const r = getRank(ele);
                            const name = "card rank-" + r  + " spades";
                            // console.log(r);
                            return (
                              <div onClick={() => toServer(colno, i)} >
                                <div>
                                  <li>
                                    <div className={name}>
                                      <span className="rank">{r}</span><span className="suit">{spadesSign}</span>
                                    </div>
                                  </li>
                                </div>
                            </div>);
                          }
                          else if(getType(ele) == "diams")
                          {
                            const r = getRank(ele);
                            const name = "card rank-" + r  + " diams";
                            // console.log(r);
                            return (
                              <div onClick={() => toServer(colno, i)} >
                                <div>
                                  <li>
                                    <div className={name}>
                                      <span className="rank">{r}</span><span className="suit">{diamondSign}</span>
                                    </div>
                                  </li>
                                </div>
                              </div>);
                          }
                          else if(getType(ele) == "clubs")
                          {
                            const r = getRank(ele);
                            const name = "card rank-" + r  + " clubs";
                            // console.log(r);
                            return (
                            <div onClick={() => toServer(colno, i)}>
                            <div>
                              <li>
                                <div className={name}>
                                  <span className="rank">{r}</span><span className="suit">{clubsSign}</span>
                                </div>
                              </li>
                            </div>
                            </div>);
                          }
                          else if(getType(ele) == "hearts")
                          {
                            const r = getRank(ele);
                            const name = "card rank-" + r  + " hearts";
                            // console.log(r);
                            return (
                            <div onClick={() => toServer(colno, i)}>
                              <div>
                              <li>
                                <div className={name}>
                                  <span className="rank">{r}</span><span className="suit">{heartSign}</span>
                                </div>
                              </li>
                            </div>
                            </div>);
                          }
                        })
                      }
                    </ul>
              </div>
            </div>
          ))
        }
      </div><div className="container">
        <div>
          <h1>Your Cards:</h1>
        </div>
        {
          <div className="playingCards fourColours rotateHand">
            <ul className="table">
              {
              cards.map((ele, i) => {
                // console.log(getRank(ele))
                if(getType(ele) == "diams")
                {
                  
                  const r = getRank(ele);
                  const name = "card rank-" + r  + " diams";
                  return(
                  <li>
                    <a className={name}><span className="rank">{getRank(ele)}</span><span className="suit">{diamondSign}</span></a>
                  </li>);
                }
                else if(getType(ele) == "hearts")
                {
                  const r = getRank(ele);
                  const name = "card rank-" + r  + " hearts";
                  return(
                  <li>
                    <a className={name}><span className="rank">{getRank(ele)}</span><span className="suit">{heartSign}</span></a>
                  </li>);
                }
                else if(getType(ele) == "spades")
                {
                  const r = getRank(ele);
                  const name = "card rank-" + r  + " spades";
                  return(
                  <li>
                    <a className={name}><span className="rank">{getRank(ele)}</span><span className="suit">{spadesSign}</span></a>
                  </li>);
                }
                else if(getType(ele) == "clubs")
                {
                  const r = getRank(ele);
                  const name = "card rank-" + r  + " clubs";
                  return(
                  <li>
                    <a className={name}><span className="rank">{getRank(ele)}</span><span className="suit">{clubsSign}</span></a>
                  </li>);
                }
              })
              }
            </ul>
          </div>
        /* code for client cards comes here */
        }
        {
          <div><div>
            <div className="text_box">{addMessage}</div>
            {/* <div className={"color"+color}></div> */}
          </div></div>
        /* code for text box comes here */
        }
        {/* code for circle representing the players team color comes here */}
      </div>
    </div>
  );
};

ReactDOM.render(<Sequence />, document.querySelector(`#root`));
