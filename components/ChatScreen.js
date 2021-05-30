import { Avatar, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useCollection } from "react-firebase-hooks/firestore";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import Message from "./Message";
import { useRef, useState } from 'react';
import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientemail";
import TimeAgo from 'timeago-react';
import dynamic from "next/dynamic";
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import Link from 'next/link'

const Picker = dynamic(() => import('emoji-picker-react') ,{
   ssr: false,
 });
const ChatScreen = ({chat,messages}) => {
   const [user] = useAuthState(auth);
   const router = useRouter();
   const [input,Setinput] = useState("");
   const endOfMessagesRef = useRef(null);
   const [selectEmoji,SetselectEmoji] = useState(false);
   const onEmojiClick = (event, emojiObject) => {
      let sym = emojiObject.unified.split('-')
      let codesArray = []
      sym.forEach(el => codesArray.push('0x' + el))
      let emoji = String.fromCodePoint(...codesArray)
     Setinput(prev => prev + emoji)
   };
   const [messagesSnapshot] = useCollection(
   db.collection('chats')
   .doc(router.query.id)
   .collection('messages')
   .orderBy('timestamp','asc') );
   const [recipientSnapshot] = useCollection(
      db.collection('users').where('email','==',getRecipientEmail(chat.users,user))
   )
   const showMessages = () => {
     if (messagesSnapshot) {
        return messagesSnapshot.docs.map(message => (
           <Message 
              key={message.id}
              user={message.data().user}
              message={{
                 ...message.data(),
                 timestamp:message.data().timestamp?.toDate().getTime()
              }
              }
           />
        ))
     }else {
        return JSON.parse(messages).map( message => {
       return  ( <Message 
         key={message.id}
         user={message.user}
         message={message}
      />)
        })
     }
   }
   const ScrollToBottom = () => {
      endOfMessagesRef.current.scrollIntoView({
         behavior : "smooth",
         block : "start",
      })
   }
   const sendMessage = (e) => {
     e.preventDefault();
     //update the last seen
     db.collection('users').doc(user.uid).set({
      lastSeen:firebase.firestore.FieldValue.serverTimestamp()
     },{merge:true});
     db.collection('chats').doc(router.query.id).collection('messages').add({
        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
        message:input,
        user:user.email,
        photoURL:user.photoURL
     });
     Setinput("");
     ScrollToBottom()
   }
   const recipient = recipientSnapshot?.docs?.[0]?.data();
   const recipientEmail = getRecipientEmail(chat.users,user);
    return ( 
        <Container>
           <Header>
           <Link href='/'>
           <a>
            <HeaderArrow>
               <KeyboardArrowLeftIcon />
            </HeaderArrow>
            </a>
            </Link>
           {
            recipient ? (
             <Avatar src={recipient.photoURL}/> )
             :(
              <Avatar>{recipientEmail[0]}</Avatar>
             )}
             <HeaderInformation>
               <h3>{recipientEmail}</h3>
               {recipientSnapshot ?(
                  <p>Last Active : {' '}
                  {recipient?.lastSeen?.toDate() ? (
                     <TimeAgo datetime={recipient?.lastSeen?.toDate()}/> 
                  ) : "Unavailable" }
                  </p>
               ):(
                <p>Loading Last Active</p>
               )}
               
             </HeaderInformation>
             <HeaderIcons>
                <IconButton>
                   <MoreVertIcon />
                </IconButton>
             </HeaderIcons>
           </Header>

           <MessageContainer>
              {showMessages()}
              <EndOfMessage ref={endOfMessagesRef}/>
           </MessageContainer>
           <InputContainer>
            <PickerContainer>
             <InsertEmoticonIcon onClick={() => SetselectEmoji(prev => !prev)}/>
            {  selectEmoji && <Picker onEmojiClick={onEmojiClick} pickerStyle={{position:'absolute',top:"-310px",left:"100%",zIndex:"1000"}} /> }
             </PickerContainer> 
             <Input value={input} onChange={(e) => Setinput(e.target.value)} placeholder="Enter Message"/>
             <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</button>
           </InputContainer>
        </Container>
     );
}
 
export default ChatScreen;

const Container = styled.div`

`;
const HeaderArrow = styled.div`
display: none;
margin: 0 5px 0 0;
@media (max-width:600px) {
display: block;
}
`; 
const Input = styled.input`
flex:1;
padding:20px;
background-color:whitesmoke;
outline:0;
border:none;
border-radius:10px;
margin-left:15px;
margin-right:15px;
`;

const InputContainer = styled.form`
 display:flex;
 align-items:center;
 padding:10px;
 position:sticky;
 bottom:0;
 background-color:white;
 z-index:100;
`;

const Header = styled.div`
   position:sticky;
   background-color:white;
   z-index:100;
   top:0;
   display:flex;
   padding:11px;
   height:80px;
   align-items:center;
   border-bottom:1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
   margin-left:15px;
   flex:1;

   >h3 {
      margin-bottom:3px
   }
   >p {
      font-size:14px;
      color:gray;
   }
`;

const EndOfMessage = styled.div`
margin-bottom:50px;
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
padding:30px;
background-color:#e5ded8;
min-height:90vh;
`;
const PickerContainer = styled.div`
position:relative;
cursor: pointer;
`;