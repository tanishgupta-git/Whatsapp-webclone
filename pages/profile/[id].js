import styled from "styled-components"

const Profile  = () => {
    return (
      <BackGroundContaniner>
      <GreenBackContainer></GreenBackContainer>
      <Container>
          Hello from profile page
      </Container>
      </BackGroundContaniner> 
    )
}
export default Profile;
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