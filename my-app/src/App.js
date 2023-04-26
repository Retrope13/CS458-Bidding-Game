import './App.css';
import * as React from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import bulletin from './assets/bulletin_board.png';
import parchment from './assets/parchment.png';


const H1 = styled.h1`
  font-size: 30px;
  color:#000;
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
  margin-bottom: 2%;
`

const BidList = styled.div`
  border-radius: 8px;
  width: 700px;
  height: 700px;
  background-color: #fff;
  box-shadow: 5px 5px #000;
  margin: '4em';
  padding: '1em';
  background-image: url(${bulletin});
  background-repeat: no-repeat;
  background-size: 100% 100%;
`

const BidSubmission = styled.div`
  margin-left: 12%;
  width: 33%;
  height: 700px;
  background-image: url(${parchment});
  background-repeat: no-repeat;
  margin-right: 15%;
  background-size: 100% 100%;
`

const ParentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #fafafa;
`
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const itemNames = ["Chicken", "Cow", "Bow", "Umbrella", "Dagger", "Helmet", "Sword", "StaffG", "Hammer", "StaffP", "ShieldC", "ShieldM", "StaffB", "Mouse", "Snake"];
const imgUrls = ["https://imgur.com/iGjWwnV.png", "https://imgur.com/EQDvmaz.png", "https://imgur.com/EItElks.png", "https://imgur.com/A1f59Gs.png", "https://imgur.com/XX96bhp.png", "https://imgur.com/B4jlaut.png", "https://imgur.com/9OmGi7B.png", "https://imgur.com/951OB6f.gif", "https://imgur.com/nwqDOeL.png", "https://imgur.com/4xswZ47.gif", "https://imgur.com/a2ZSNWb.png", "https://imgur.com/mRZvTbf.png", "https://imgur.com/wb5tKex.gif", "https://imgur.com/ycrK37X.png", "https://imgur.com/dqz4oZt.png"];

const pets = ["Chicken", "Cow", "Snake", "Mouse"];

function App() {
  const [item, setItem] = useState(null);
  const [currTime, setCurrTime] = useState(new Date());
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [balanceWei, setBalanceWei] = useState(null);
  const [balanceEth, setBalanceEth] = useState(null);


  //initialize web3 to ask for MetaMask log in and take pub key and balance
  useEffect(() => {
    async function initWeb3() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);

        try {
          await window.ethereum.request({method: "eth_requestAccounts"});
          const accounts = await web3.eth.getAccounts();
          setBalanceWei(await web3.eth.getBalance(accounts[0]));
          setBalanceEth(await web3.utils.fromWei(balanceWei, 'ether'));
          setAccount(accounts[0]);
          console.log(account);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error("Please install MetaMask to use this application.");
      }
    }

    initWeb3();
  }, []);


  //set the current time every second so that it can be displayed on the page
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrTime(new Date());
    }, 1000); 
    return () => clearInterval(interval);
  }, []);


  //When an hour has passed generate a "random" item to be up for auction
  useEffect(() => {
    setItem(getRandomInt(15));
  },[]);
  

  //Tick down every second to keep track of the hour, when an hour has passed reload the page
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const minsUntilNextHour = 60 - now.getMinutes();
      const secsUntilNextHour = minsUntilNextHour * 60 - now.getSeconds(); 
      setTimeout(() => {
        window.location.reload();
      }, secsUntilNextHour*1000);
      setItem(getRandomInt(15));
    }, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);


  function checkBalance() {

  }


  return (
    <div className="App">
      <head>

      <title>Bidder, Faster, Stronger</title>
      </head>
      <body>
        <H1>Hear ye hear ye! Another item is up for grabs!</H1>
        <h2>You have until the clock rings the new hour to stake your claim!</h2>
        <div>
          <h1>{currTime.toLocaleTimeString()}</h1>
        </div>
        <div>
          <img src={imgUrls[item]}/>
        </div>
        {pets.includes(itemNames[item]) ? <FenceHolder src='https://imgur.com/JGGeue7.png'/>:
        <div></div>}

          </body>
        <ParentContainer style={{backgroundColor: '#F5F5DC'}}>
          <BidList className='bidList'>
          </BidList>

          <BidSubmission className="bidSubmission">
          {account ? (<div>
             <h4 className="gold">Your Current Gold:  {balanceEth.toString()} WETH</h4>

             <h4 className='title'>Your Surname:</h4>
             <h4>{account}</h4>

             <h4 className='title'>Your current bid: (Eth)</h4>
             <input type='number' min={0} onChange={checkBalance}></input> <h4>fda</h4></div>)
             
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
    </div>
  );

}

export default App;
