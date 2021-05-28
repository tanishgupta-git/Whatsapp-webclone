import { Avatar, Button, IconButton } from "@material-ui/core";
import styled from "styled-components";
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator';
import { auth,db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useState } from 'react';
import Chat from "./Chat";
import getRecipientEmail from "../utils/getRecipientemail";

const Sidebar = ({minDisplay,width}) => {
  const [user] = useAuthState(auth);
  const userChatRef = db.collection('chats').where('users','array-contains',user.email);
  const [chatsSnapshot] = useCollection(userChatRef);
  const [search,Setsearch] = useState(); 

  const createChat = () => {
    const input = prompt(
      'Please enter any email address for the user you wish to chat with'
    );
    
    if (!input) return null;

    if(
      EmailValidator.validate(input)  
      && !chatAlreadyExists(input) 
      && input != user.email )
      {
      // we need to add the chat into the DB 'chats' collection if it doesn't already exists and is valid

      db.collection('chats').add({
        users:[user.email,input]
      })
    }
  }
  const chatAlreadyExists = (recipientEmail) => 
     !!chatsSnapshot?.docs.find(chat => chat.data().users.find(user => user === recipientEmail)?.length > 0
     );  
  
    return (
        <Container minDisplay={minDisplay} width={width}>

          <Header>
            <UserAvatar src={user.photoURL} onClick={() => auth.signOut()}/>
            <IconsContainer>
             <IconButton>
               <ChatIcon />
            </IconButton>
            <IconButton>
               <MoreVertIcon />
            </IconButton>
            </IconsContainer>
          </Header>
         
          <Search>
            <SearchIcon />
            <SearchInput placeholder='Search in chats' onChange={ (e) => Setsearch(e.target.value)}/>
          </Search>


          <SidebarButton onClick={createChat} >Start a new chat</SidebarButton>
          {/* list of chats */}
          { 
              search ? 
              ( chatsSnapshot?.docs.filter(chat => ( getRecipientEmail(chat.data().users,user).indexOf(search) !== -1 ))
              .map( chat => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users}/>
              ))

              )
               : 
              ( 
              chatsSnapshot?.docs.map( chat => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users}/>
              ))
      
              ) 
          }
        </Container>
      );
}
 
export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right:1px solid whitesmoke;
  height:100%;
  min-width:350px;
  max-width: 400px;
  overflow-y:scroll;
  background-color: #ffffff;
  z-index: 1;
  ::-webkit-scrollbar {
    display:none;
  }
  -ms-overflow-style:none;
  scrollbar-width:none;
  @media  (max-width:600px) {
  max-width: 600px;
  width:${props => props.width};
  flex:1;
  display: ${props => props.minDisplay};
}
`;


const Search = styled.div`
display:flex;
align-items:center;
padding:15px;
border-radius:2px;
`;

const SidebarButton = styled(Button)`
width:100%;
&&& {
    border-top:1px solid whitesmoke;
    border-bottom:1px solid whitesmoke;
}`;


const SearchInput = styled.input`
outline-width:0;
border:none;
flex:1;
z-index: 1;
margin-left: 10px;
font-size: 1em;
`;


const Header = styled.div`
display:flex;
position:sticky;
top:0;
background-color:#EDEDED;
z-index:1;
justify-content:space-between;
align-items:center;
padding:15px;
height:80px;
border-bottom:1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
cursor: pointer;
 :hover{
  opacity:0.8;
} `;

const IconsContainer = styled.div``;