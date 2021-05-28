import styled from "styled-components"

const StartChat = () => {
 return (
     <Container>
         <Image src='/onlineMessanging.svg' alt=''/>
         <Heading>Whatsapp Web Clone</Heading>
     </Container>
 )
}

const Container = styled.div`
background-color: #f8f9fa;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
width: 100%;
z-index: 1;
@media  (max-width:600px) {
  display: none;
}
`;
const Image = styled.img`
width: 250px;
`;
const Heading = styled.h1`
color:#525252;
font-weight: 300;
font-size: 2em;
`;
export default StartChat;