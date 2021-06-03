import styled from "styled-components"
import {auth, db} from '../../firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import Link from 'next/link'
import { IconButton } from "@material-ui/core";
const Profile  = ({profileData}) => {
    const [user] = useAuthState(auth);
    const profile = JSON.parse(profileData)

    return (
      <BackGroundContaniner>
      <GreenBackContainer></GreenBackContainer>
      <Container>
      <Header>
           <Link href='/'>
           <a>
            <HeaderArrow>
            <IconButton>
               <KeyboardArrowLeftIcon />
            </IconButton>
            </HeaderArrow>
            </a>
            </Link>
    </Header>
      <FlexContainer>
        <ProfileImage src={profile.photoURL} alt="" />
        <div>
        <p>   { '   ' + profile.email}</p>
        {user.uid === profile.id &&  <button>Edit Profile</button>}
        </div>
      </FlexContainer>

      </Container>
      </BackGroundContaniner> 
    )
}
export default Profile;

export async function getServerSideProps(context) {
    const profileDoc = await db.collection('users').doc(context.query.id).get();
    // returning the profile data
    const profileData = {
        id : profileDoc.id,
        ...profileDoc.data()
    }
    return {
        props : {
            profileData :JSON.stringify(profileData)
        }
    }
} 

// styled compenents
const Header = styled.div`
   z-index:100;
   top:0;
   display:flex;
   padding:11px;
   height:80px;
   align-items:center;
`;
const HeaderArrow = styled.div`
margin: 0 5px 0 0;
svg {
  color:#ffffff;
  font-size: 1.5em;
}
`; 
const Container = styled.div`

width:90%;
margin:auto;
height: 90vh;
z-index: 10;
@media (max-width:900px){
    width:100%;
    height: 100vh;
}
`;
const FlexContainer = styled.div`
 display: flex;
 @media (max-width:720px) {
   flex-direction: column;
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

const ProfileImage = styled.img`
  width: 230px;
  height: 230px;
  border-radius: 50%;
  object-fit: cover;
`;