import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import StartChat from '../components/StartChat'
import styled from "styled-components";

export default function Home() {
  return (
    <BackGroundContaniner>
    <GreenBackContainer></GreenBackContainer>
     <Container>
      <Head>
        <title>Whatsapp</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

    <Sidebar minDisplay="block" width="100%"/>
    <StartChat />
    </Container>
    </BackGroundContaniner> 
  )
}

const Container = styled.div`
display:flex;
width:90%;
margin:auto;
height: 90vh;
@media (max-width:900px){
    width:100%;
    height: 100vh;
}
`;

const BackGroundContaniner = styled.div`
display: flex;
align-items: center;
height: 100vh;
background-color: #dbdbdb;
position: relative;
`;
const GreenBackContainer = styled.div`
position: absolute;
top:0;
left:0;
width:100%;
height: 30%;
background-color: #009788;
z-index: 0;
`;
