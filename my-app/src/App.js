import './App.css';
import * as React from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';


const H1 = styled.h1`
  font-size: 30px;
  color:#000;
  font-family: sans-serif;
`
const H2 = styled.h2`
  font-size: 20px;
  color:#000;
  font-family: sans-serif;
`


const Container = styled.div`
  border-radius: 8px;
  width: 400px;
  height: 400px;
  background-color: #fff;
  box-shadow: 5px 5px #e8e6e6;
  margin: '4em';
  padding: '1em';
`

const ParentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #fafafa;
`
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const itemNames = ["Chicken", "Cow", "Bow", "Umbrella", "Dagger", "Helmet", "Sword", "StaffG", "Hammer", "StaffP", "ShieldC", "ShieldM", "StaffB", "Mouse", "Snake"]
const imgUrls = ["https://imgur.com/iGjWwnV.png", "https://imgur.com/EQDvmaz.png", "https://imgur.com/EItElks.png", "https://imgur.com/A1f59Gs.png", "https://imgur.com/XX96bhp.png", "https://imgur.com/B4jlaut.png", "https://imgur.com/9OmGi7B.png", "https://imgur.com/951OB6f.gif", "https://imgur.com/nwqDOeL.png", "https://imgur.com/4xswZ47.gif", "https://imgur.com/a2ZSNWb.png", "https://imgur.com/mRZvTbf.png", "https://imgur.com/wb5tKex.gif", "https://imgur.com/ycrK37X.png", "https://imgur.com/dqz4oZt.png"]

function App() {
  const [item, setItem] = useState(null);
  const [currTime, setCurrTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setItem(getRandomInt(15));
  }, 60 * 60 * 1000);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const minsUntilNextHour = 60 - now.getMinutes();
      const secsUntilNextHour = minsUntilNextHour * 60 - now.getSeconds();
      setTimeout(() => {
        window.location.reload();
      }, secsUntilNextHour*1000);
    }, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <body>
        <H1>Make a bid for the item up for auction!</H1>
        <h2>Auctions change every hour.</h2>
        <div>
          <h1>{currTime.toLocaleTimeString()}</h1>
        </div>
        <div>
          <img src={imgUrls[item]}/>
        </div>
          </body>
        <ParentContainer>
          <Container className='bidList'>
          <Box><table>
            <td><p>fds</p></td>
            <td>ghf</td>
          </table></Box>
          </Container>

          <Container className='bidSubmission'>
            <div className='balanceDiv'>fdjhsaklfsdj</div>
            <Button classname="Button" style={{backgroundColor: "#007aff", marginLeft: "70%", marginTop: "5%"}}><a>submit bid</a></Button>
          </Container>
        </ParentContainer>
    </div>
  );
}

export default App;
