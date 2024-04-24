import { useUser } from '../../config/UserContext';
import styles from './About.module.css';

const About = () => {
  const { currentUser, loading } = useUser();

  const chapterData = currentUser.chapterData;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.containerStyle}>
      <div className={styles.mainBoxStyle}>
        <h1 className={styles.textStyle}>About {chapterData.name}</h1>
        <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id consectetur est. Nulla quis erat sit amet dolor facilisis sodales dignissim eget augue. Integer sed eros sit amet mauris porta egestas. Sed pulvinar ex consectetur nibh ornare posuere. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed ac dapibus velit. Nunc mattis ex ut lacus semper, ut ullamcorper diam maximus. Pellentesque enim eros, auctor quis vehicula vel, luctus ut enim. Ut aliquam dui felis, ut tristique ante elementum ut. Nullam urna odio, aliquet in scelerisque at, mollis sit amet nunc. Aenean pharetra justo ac turpis fermentum, eu tempor elit tristique.</h2>
        <div className={styles.statistics}>
          <div className={styles.divStyle}>
            <h3 className={styles.headingStyle}>TOTAL MEMBERS</h3>
            <h3 className={styles.textStyle}>{chapterData.totalActive + chapterData.totalLapsed}</h3>
          </div>
          <div className={styles.verticalLine}></div>
          <div className={styles.divStyle}>
            <h3 className={styles.headingStyle}>TOTAL VOLUNTEERS</h3>
            <h3 className={styles.textStyle}>{currentUser.chapterData.volunteers}</h3>
          </div>
          <div className={styles.verticalLine}></div>
          <div className={styles.divStyle}>
            <h3 className={styles.headingStyle}>TOTAL HOURS</h3>
            <h3 className={styles.textStyle}>{currentUser.chapterData.hours}</h3>
          </div>
          <div className={styles.verticalLine}></div>
          <div className={styles.divStyle}>
            <h3 className={styles.headingStyle}>TOTAL PEOPLE SERVED</h3>
            <h3 className={styles.textStyle}>{currentUser.chapterData.peopleServed}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
