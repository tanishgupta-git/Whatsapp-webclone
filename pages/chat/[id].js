import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import {auth, db} from '../../firebase';
import getRecipientEmail from "../../utils/getRecipientemail";

const Chat = ({chat,messages}) => {
    const [user] = useAuthState(auth);

    return (
     <BackGroundContaniner>
           <GreenBackContainer></GreenBackContainer>
            <Container>
                <Head>
                    <title>Chat with {getRecipientEmail(chat.users,user)}</title>
                </Head>
                <Sidebar minDisplay="none" width="0" />
                <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
                </ChatContainer>
            </Container>
        </BackGroundContaniner>  
    );
}
 
export default Chat;

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);
  // prep the messages on server
  const messagesRes = await ref.collection('messages').orderBy('timestamp','asc').get();

  const messages = messagesRes.docs.map( doc => ({
      id:doc.id,
      ...doc.data()
  })).map(messages => ({
      ...messages,
      timestamp : messages.timestamp.toDate().getTime(),
  }));
 
  // prep that chats
  const chatRes = await ref.get();
  const chat = {
      id : chatRes.id,
      ...chatRes.data()
  }
  return {
      props : {
          messages : JSON.stringify(messages),
          chat : chat
      }
  }

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

const ChatContainer = styled.div`
flex:1;
overflow:scroll;
height:100%;
z-index: 1000;
::-webkit-scrollbar {
    display:none;
}
-ms-overflow-style:none;
scrollbar-width:none;
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
