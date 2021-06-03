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
import Link from 'next/link'

const Sidebar = ({minDisplay,width}) => {
  const [user] = useAuthState(auth);
  const userChatRef = db.collection('chats').where('users','array-contains',user.email);
  const [chatsSnapshot] = useCollection(userChatRef);
  const [search,Setsearch] = useState(); 
  const [popUpHeader,SetpopUpHeader] = useState(false); 

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
    }else{
      alert("Enter a valid email");
    }
  }
  const chatAlreadyExists = (recipientEmail) => 
     !!chatsSnapshot?.docs.find(chat => chat.data().users.find(user => user === recipientEmail)?.length > 0
     );  
  
    return (
        <Container minDisplay={minDisplay} width={width}>

          <Header>
           <Link href={`/profile/${user.uid}`}>
              <a>
               <UserAvatar src={user.photoURL}/>
              </a>
            </Link>
            <IconsContainer>
            <Link href="/">
            <a>
              <IconButton>
                <ChatIcon />
              </IconButton>
            </a>
            </Link>
              <IconButton onClick={ () => SetpopUpHeader(prev => !prev)}>
                <MoreVertIcon />
              </IconButton>
             { 
               popUpHeader && 
               <HeaderPopUp>
               <Link href={`/profile/${user.uid}`}>
               <a>
                <HeaderItem>
                        My Profile
                  </HeaderItem>
                </a>
                </Link>
                <HeaderItem onClick={() => auth.signOut()}>
                      Logout
                </HeaderItem>
                </HeaderPopUp>
             }
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
  @media  (max-width:720px) {
  max-width: 720px;
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
z-index:2;
justify-content:space-between;
align-items:center;
padding:15px;
height:80px;
border-bottom:1px solid whitesmoke;
@media (max-width:720px) {
      background-color: #075e55;
   }
`;
const HeaderPopUp = styled.ul`
margin:0;
padding:0;
list-style: none;
position: absolute;
top:35px;
right:30px;
background-color:#ffffff;
box-shadow: -2px -2px 2px rgba(0,0,0,0.09),2px 2px rgba(0,0,0,0.09);
border-radius: 2px;
width:220px;
`;
const HeaderItem = styled.li`
padding:20px;
text-align: center;
width:100%;
cursor: pointer;
:hover {
 background-color : #dbdbdb;
}
`;
const UserAvatar = styled(Avatar)`
cursor: pointer;
 :hover{
  opacity:0.8;
} `;

const IconsContainer = styled.div`
position:relative;

@media (max-width:720px) {
 svg {
   color:#ffffff;
 }
 
}`
 ;