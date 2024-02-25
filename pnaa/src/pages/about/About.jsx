import React from 'react';
import { useUser } from '../../config/UserContext';

const About = () => {
  const { currentUser, loading } = useUser();
  
  if (loading) { 
    return <div>Loading...</div>;
  }

  const textStyle = {
    fontFamily: 'Arial, sans-serif',
    fontSize: '40px', // Set the font size to 40px
    lineHeight: '16px',
  };

  return (
    <div style={{
      width: '1298px',
      height: '766px',
      position: 'absolute',
      top: '204px',
      left: '71px',
      borderRadius: '0px 0px 15px 15px',
      backgroundColor: '#D9D9D9',
      padding: '20px',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '1272px',
        height: '740px',
        position: 'absolute',
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
        <h1 style={textStyle}>About {currentUser.chapterData.name}</h1>
        <div style={{ margin: '50px 0' }}></div> {/* Margin between h1 and h2 */}
        <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id consectetur est. Nulla quis erat sit amet dolor facilisis sodales dignissim eget augue. Integer sed eros sit amet mauris porta egestas. Sed pulvinar ex consectetur nibh ornare posuere. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed ac dapibus velit. Nunc mattis ex ut lacus semper, ut ullamcorper diam maximus. Pellentesque enim eros, auctor quis vehicula vel, luctus ut enim. Ut aliquam dui felis, ut tristique ante elementum ut. Nullam urna odio, aliquet in scelerisque at, mollis sit amet nunc. Aenean pharetra justo ac turpis fermentum, eu tempor elit tristique.</h2>
        {currentUser.chapterData && (
          <>
            <div style={{ display: 'flex' }}>
              <div>
                <h3 style={textStyle}>Total Members</h3>
                <h3 style={textStyle}>{currentUser.chapterData.memberCount}</h3>
              </div>
              <div style={{ borderRight: '1px solid #000', margin: '40px 10px 0 10px', position: 'relative', top: '40px', height: '100.5px', left: '' }}></div> {/* Vertical line */}
              <div>
                <h3 style={{ ...textStyle, marginRight: '10px' }}>Total Volunteers</h3>
                <h3 style={textStyle}>{0}</h3>
              </div>
              <div style={{ borderRight: '1px solid #000', margin: '40px 10px 0 10px', position: 'relative', top: '40px', height: '100.5px' }}></div> {/* Vertical line */}
              <div>
                <h3 style={{ ...textStyle, marginRight: '10px' }}>Total Hours</h3>
                <h3 style={textStyle}>{0}</h3>
              </div>
              <div style={{ borderRight: '1px solid #000', margin: '40px 10px 0 10px', position: 'relative', top: '40px', height: '100.5px' }}></div> {/* Vertical line */}
              <div>
                <h3 style={textStyle}>Total People Served</h3>
                <h3 style={textStyle}>{0}</h3>
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default About;
