"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import './globals.css';
import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleSignupClick = () => {
    router.push('/signup');
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'feedback'));
        const feedbackList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(feedbackList);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>SafeMail</div>
          <nav className={styles.nav}>
            <a href="#home" className={styles.navItem}>Home</a>
            <a href="#reviews" className={styles.navItem}>Reviews</a>
            <a href="#team" className={styles.navItem}>Our Team</a>
            <button className={styles.button} onClick={handleLoginClick}>Login</button>
            <button className={styles.button} onClick={handleSignupClick}>Signup</button>
          </nav>
        </header>

        <main className={styles.main}>
          <section id="home" className={`${styles.hero} ${styles.fullHeight}`}>
            <h1 className={styles.title}>AI Customer Service for SafeMail</h1>
            <p className={styles.description}>Get to know what SafeMail is, by interacting with our AI Customer Support Chatbot.</p>
            <button className={styles.getStartedButton} onClick={handleSignupClick}>Get Started</button>
          </section>
          <hr></hr>

          <section id="reviews" className={`${styles.reviews} ${styles.fullHeight}`}>
            <h2 className={styles.sectionTitle}>Reviews</h2>
            <div className={styles.reviewContainer}>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className={styles.reviewCard}>
                    <img src={review.profileImageUrl || ''} alt="User" className={styles.reviewImage} />
                    <div className={styles.reviewContent}>
                      <p>"{review.review}"</p>
                      <div className={styles.stars}>
                        {'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
                      </div>
                      <span>- {review.fullName}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No reviews available.</p>
              )}
            </div>
            
          </section>
          <hr></hr>
          <section id="team" className={`${styles.team} ${styles.fullHeight}`}>
            <h2 className={styles.sectionTitle}>Our Team</h2>
            <div className={styles.teamContainer}>
              <div className={styles.teamCard}>
                <img src="https://media.licdn.com/dms/image/D5603AQE_KNzf_aFGXg/profile-displayphoto-shrink_800_800/0/1708485647464?e=1728518400&v=beta&t=BDazDaX1tEKJd-E4_HkFOzyg4lEDoUtizyZ1n6obuRA" alt="Bhavana" className={styles.teamImage} />
                <div className={styles.teamContent}>
                  <h3>Bhavana Sree Naidu Yeluri</h3>
                </div>
              </div>
              <div className={styles.teamCard}>
                <img src="https://media.licdn.com/dms/image/D5603AQG99KQa_l60xw/profile-displayphoto-shrink_200_200/0/1721289753190?e=1728518400&v=beta&t=eIL4mRiTTmu7EJ9KU4gMe-mWBbf7-Ya9__WJg9DOmmc" alt="Sana" className={styles.teamImage} />
                <div className={styles.teamContent}>
                  <h3>Sana Ekram</h3>
                </div>
              </div>
              <div className={styles.teamCard}>
                <img src="https://media.licdn.com/dms/image/D4D03AQEAyrfoFRsCfA/profile-displayphoto-shrink_800_800/0/1705992358845?e=1728518400&v=beta&t=1WNAQyjsZ6rpztRLDzusDAtB91cYyuSvjNlGSPDOqsw" alt="Abdullah" className={styles.teamImage} />
                <div className={styles.teamContent}>
                  <h3>Abdullah Bin Altaf</h3>
                </div>
              </div>
              <div className={styles.teamCard}>
                <img src="https://media.licdn.com/dms/image/v2/D5603AQEpJ5n7F3DMuw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1690056719269?e=1728518400&v=beta&t=EydZnOHDP5LXQNsD6I7HFjhkzyab_enCW116hKK4-sg" alt="Nate" className={styles.teamImage} />
                <div className={styles.teamContent}>
                  <h3>Nathaniel Rankine</h3>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <footer className={styles.footer}>
          <p>&copy; 2024 SafeMail. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
