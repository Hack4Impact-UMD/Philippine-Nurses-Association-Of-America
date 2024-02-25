import React from 'react';
import { useUser } from '../../config/UserContext';

const About = () => {
  const { currentUser, loading } = useUser();
  
  if (loading) { 
    return <div>Loading...</div>;
  }

  const textStyle = {
    fontFamily: 'Source Serif 4',
    fontSize: '40px', // Set the font size to 40px
    lineHeight: '16px',
    color: "#4F4F4F"
  };

  const headingStyle = {
    fontFamily:"Source Serif 4",
    color: "#4F4F4F"
  };
  const statistics = {
    display: "flex",
    justifyContent: "space-around",
    color: "#4F4F4F",
    alignItems: "center"

  }
  const verticalLine=  {
    width: "0%",
    border: "2px",
    borderStyle:"solid",
    height:"80px",
    color: "#4F4F4F"
  }

  const divStyle = {
    width: "15%",
    padding: "50px"
  };

  const container={
  width: '1298px',
  height: '766px',
  top: '204px',
  left: '71px',
  borderRadius: '0px 0px 15px 15px',
  backgroundColor: '#D9D9D9',
  padding: '20px',
  overflow: 'hidden'}


  return (
    <div style={container}>
      <div style={{
        width: '1272px',
        height: '740px',
        top: '10px',
        left: '10px',
        right: '10px',
        bottom: '10px',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #000',
        padding: '20px',
        overflow: 'auto'  // Add overflow auto if the content exceeds the box dimensions
      }}>
        {/*<h1 style={textStyle}>About {currentUser.chapterData.name}</h1>*/}
         <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id consectetur est. Nulla quis erat sit amet dolor facilisis sodales dignissim eget augue. Integer sed eros sit amet mauris porta egestas. Sed pulvinar ex consectetur nibh ornare posuere. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed ac dapibus velit. Nunc mattis ex ut lacus semper, ut ullamcorper diam maximus. Pellentesque enim eros, auctor quis vehicula vel, luctus ut enim. Ut aliquam dui felis, ut tristique ante elementum ut. Nullam urna odio, aliquet in scelerisque at, mollis sit amet nunc. Aenean pharetra justo ac turpis fermentum, eu tempor elit tristique.</h2>
        {currentUser.chapterData && (
          <>
          </>
        )}
        <div style={statistics}>
              <div style={divStyle}>
              <h3 style={headingStyle}>TOTAL MEMBERS</h3>
                <h3 style={textStyle}>{5}</h3>
              </div>
              <div style = {verticalLine}></div>
              <div style={divStyle}>
                <h3 style={headingStyle}>TOTAL VOLUNTEERS</h3>
                <h3 style={textStyle}>{150}</h3>
              </div>
              <div style = {verticalLine}></div>
              <div style={divStyle}>
                <h3 style={headingStyle}>TOTAL HOURS</h3>
                <h3 style={textStyle}>{10}</h3>
              </div>
              <div style = {verticalLine}></div>
              <div style={divStyle}>
                <h3 style={headingStyle}>TOTAL PEOPLE SERVED</h3>
                <h3 style={textStyle}>{40}</h3>
              </div>
            </div>
      </div>
        </div>


  )};

export default About;