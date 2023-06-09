import './App.css';
import * as React from 'react';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import bulletin from './assets/bulletin_board.png';
import parchment from './assets/parchment.png';
import wood from './assets/woodTable.png';
import fence from './assets/fence.png';
import contractABI from './build/contracts/BidderFasterStronger.json';
const contractAddress = '0x556a07eEcc54F07C3B4dbe02888594070d5b094a'; //The address of the contract at the time of testing this. This changes whenever truffle is redeployed 

const H1 = styled.h1`
  font-size: 30px;
  color:#fff;
  font-family: Alagard;
`
const H2 = styled.h2`
  font-size: 20px;
  color:#000;
  font-family: sans-serif;
`

const FenceHolder = styled.img`
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  height: 150%;
  width: 150%;
  margin-top: -100%;
  margin-bottom: 0%;
`

const BidList = styled.div`
  border-radius: 8px;
  width: 700px;
  height: 600px;
  background-color: #fff;
  box-shadow: 5px 5px #000;
  margin: '4em';
  padding: '1em';
  background-image: url(${bulletin});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-top: 1.5%
`

const BidSubmission = styled.div`
  margin-left: 12%;
  width: 33%;
  height: 750px;
  background-image: url(${parchment});
  background-repeat: no-repeat;
  margin-right: 15%;
  background-size: 100% 100%;
`

const ParentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background-image: url(${wood});
  border-radius: 500px;
  background-size: 175% 175%;
`

const Floor = styled.div`
  background-color: #643926;
`

const FirstBid = styled.h4`
  font-family: Alagard;
  margin-top: 17%;
  white-space: pre;
`
const NextBid = styled.h4`
  font-family: Alagard;
  white-space: pre;
  margin-top: 8%;
`

const itemNames = ["Chicken", "Cow", "Bow", "Umbrella", "Dagger", "Helmet", "Sword", "StaffG", "Hammer", "StaffP", "ShieldC", "ShieldM", "StaffB", "Mouse", "Snake"];
const imgUrls = ["https://imgur.com/iGjWwnV.png", "https://imgur.com/EQDvmaz.png", "https://imgur.com/EItElks.png", "https://imgur.com/A1f59Gs.png", "https://imgur.com/XX96bhp.png", "https://imgur.com/B4jlaut.png", "https://imgur.com/9OmGi7B.png", "https://imgur.com/951OB6f.gif", "https://imgur.com/nwqDOeL.png", "https://imgur.com/4xswZ47.gif", "https://imgur.com/a2ZSNWb.png", "https://imgur.com/mRZvTbf.png", "https://imgur.com/wb5tKex.gif", "https://imgur.com/ycrK37X.png", "https://imgur.com/dqz4oZt.png"];

const pets = ["Chicken", "Cow", "Snake", "Mouse"];
let bids = [];

const web = new Web3("http://127.0.0.1:9545"); // hosting this using ganache and truffle
function App() {
  const [item, setItem] = useState(null);
  const [currTime, setCurrTime] = useState(new Date());
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(web);
  const [balanceEth, setBalanceEth] = useState(0);
  const [currBid, setCurrBid] = useState(null);
  const [randomNum, setRandomNum] = useState(null);
  const [bidders, setBidders] = useState([]);
  const [highestBids, setHighestBids] = useState([]); 
  const contract = new web3.eth.Contract(contractABI.abi, contractAddress);
  //initialize web3 to ask for MetaMask log in and take pub key and balance
  //since we're using a test net this has to be modified to conform to the above comment^^ (we would just use window.ethereum instead)
  useEffect(() => {
    async function initWeb3() {        
        try {
          const accounts = await web3.eth.getAccounts();
          const balance = await web3.eth.getBalance(accounts[2]); 
          setBalanceEth(web3.utils.fromWei(balance, 'ether'));
          setAccount(accounts[2]);
          const options = {from: account, value: 3600};
          if (account) {
            contract.methods.startAuction(3600).send(options);
            getRand();
          }
        } catch (error) {
          console.error(error);
        }
    }

    initWeb3();
  }, [web3]);

    async function getRand() {
      if (account) {
        try {
          //right after you've deployed the contract you make a call to the generateRandomNum() from the contract from the truffle command line interface and it will generate one random number and distribute it across all users.
          //Then getRandomNum() will get the randomNum that the previous call to the contract generated.
          const value = await contract.methods.getRandomNum().call();    
          setItem(value);
        } catch(error) {
          alert(error); 
        }
      }
    }

  function convertToMilitary() { //this would accept the argument timestamp
    const date = new Date(); // convert timestamp to milliseconds //this would pass timestamp * 1000 in the date function
    const hours = date.getHours().toString().padStart(2, '0'); // add leading zero if necessary
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    if (minutes === 0 && seconds === 0) {
      getRand();
      contract.methods.endAuction().call();
      contract.methods.setCurrentNFT().call();
    }
    return `${hours}:${minutes}:${seconds}`;
  }


  //set the current time every second so that it can be displayed on the page
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const timeStamp = await contract.methods.getCurrentTime().call();// When using a local test net the timestamp won't be updated between function calls. On a public network this won't happen
      const militaryTime = convertToMilitary(); // in reality this would have the parameter timestamp
      setCurrTime(militaryTime);
      const highestBidder = await contract.methods.getHighestBidder().call();
      const highestBid = await contract.methods.getHighestBid().call();
      if (bidders) {
        setBidders(prevBidders => {
          const bidderStr = highestBidder.slice(0, 15) + "...                 " + highestBid[0] +"."+ highestBid.slice(1,3)+" (ETH)"; //this doesn't like decimals
          if (!prevBidders.includes(bidderStr)) {
            const temp = [...prevBidders, bidderStr].sort();
            highestBids.push(highestBid);
            return temp;
          }
          return prevBidders;
        })
      }
      }, 1000);

    return () => clearInterval(intervalId);
  }, []);  


  async function handleSubmit() {
    if (currBid <= balanceEth) {
      if (account) {
        try {
          const bidAmount = web3.utils.toWei(currBid, 'ether');
          const options = {from: account, value: bidAmount};
          await contract.methods.placeBid(bidAmount).send(options);
          bids.push(account.slice(0, 15) + "...        " + bidAmount + "(ETH)");
        } catch(error) {
          alert(error);
        }
      }
    } else {
      alert("You do not have enough gold to submit that bid"); 
    }
  }

  function checkBalance(event) {
    setCurrBid(event.target.value);
  }

  function getBids() {
      bids.sort();
      return <> 
      <FirstBid>
        {bidders[5]}
      </FirstBid>
      <NextBid>
      {bidders[4]}
      </NextBid>
      <NextBid>
      {bidders[3]}
      </NextBid>
      <NextBid>
      {bidders[2]}
      </NextBid>
      <NextBid>
      {bidders[1]}
      </NextBid>
      <NextBid>
      {bidders[0]}
      </NextBid>
      </>
  }


  return (
    <div className="App">
      {pets.includes(itemNames[item]) ?
      <body className='pasture'>
        <H1>Hear ye hear ye! Another item is up for grabs!</H1>
        <h2>You have until the clock rings the new hour to stake your claim!</h2>
        <div>
          <h1>{currTime.toString()}</h1>
        </div>
        <div>
          <img src={imgUrls[item]}/>
        </div>
        <FenceHolder src= {fence}/>
        </body>
        :
        <body className='wall'>
        <H1>Hear ye hear ye! Another item is up for grabs!</H1>
        <h2 style={{color: '#fff'}}>You have until the clock rings the new hour to stake your claim!</h2>
        <div>
          <h1 style={{color: '#fff'}}>{currTime.toString()}</h1>
        </div>
        <div>
          <img src={imgUrls[item]}/>
        </div>
        </body>}
        <Floor>
        <ParentContainer style={{backgroundColor: '#643926'}}>
          <BidList className='bidList'>
            {getBids()}
          </BidList>

          <BidSubmission className="bidSubmission">
          {account ? (<div>
             <h4 className="gold">Your Current Gold:</h4>
             <h4>{balanceEth.toString()} ETH</h4>

             <h4 className='title'>Your Surname:              |           Your Bid(ETH):</h4>
             <form>
             <h4>{account.slice(0, 25)}...         <input type='number' step='0.00001' min={0.0001} onChange={checkBalance}></input></h4>
             </form>
             <button className='Button' onClick={handleSubmit}>SUBMIT BID</button> 
             </div>)
             : (<h4 className='gold'>Sign into MetaMask to see your gold</h4>)}
          </BidSubmission>  
          {/* <Container className='bidSubmission'>
             {account ? (<div><h4>Your public key:</h4><p>{account}</p>
             <h4>Your current balance:</h4>
             <div className='balanceDiv'>{balanceEth.toString()} WETH</div>
             <h4>Your current bid: (Eth)</h4>
             <input type='number' min={0} onChange={checkBalance}></input></div>
             ) : (<img src={parchment}/>)} 
            <Button className="Button" style={{backgroundColor: "#007aff", marginTop: "5%"}}><a>submit bid</a></Button>
          </Container> */}
        </ParentContainer>
        </Floor>
        <footer></footer>
    </div>
  );

}

export default App; 
