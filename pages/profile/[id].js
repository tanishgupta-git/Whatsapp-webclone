import styled from "styled-components"
import {auth, db} from '../../firebase';
import { useAuthState } from "react-firebase-hooks/auth";

const Profile  = ({profileData}) => {
    const [user] = useAuthState(auth);
    const profile = JSON.parse(profileData)
    return (
      <BackGroundContaniner>
      <GreenBackContainer></GreenBackContainer>
      <Container>
      Hello from profile
         { '   ' + profile.email}
       {user.uid === profile.id ? "Owner of the profile" : "just a random viewer"}
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
const Container = styled.div`
display:flex;
width:90%;
margin:auto;
height: 90vh;
z-index: 10;
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