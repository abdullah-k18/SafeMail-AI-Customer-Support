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
    <body className={styles.body}>
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

          <section id="team" className={`${styles.team} ${styles.fullHeight}`}>
            <h2 className={styles.sectionTitle}>Our Team</h2>
            <div className={styles.teamContainer}>
              <div className={styles.teamCard}>
                <img src="/johnDoe.jpg" alt="Nate" className={styles.teamImage} />
                <div className={styles.teamContent}>
                  <h3>Nate</h3>
                  <p>Developer</p>
                </div>
              </div>
              <div className={styles.teamCard}>
                <img src="/janeSmith.jpg" alt="Bhavana" className={styles.teamImage} />
                <div className={styles.teamContent}>
                  <h3>Bhavana</h3>
                  <p>Developer</p>
                </div>
              </div>
              <div className={styles.teamCard}>
                <img src="/emilyJohnson.jpg" alt="Sana" className={styles.teamImage} />
                <div className={styles.teamContent}>
                  <h3>Sana</h3>
                  <p>Developer</p>
                </div>
              </div>
              <div className={styles.teamCard}>
                <img src="/emilyJohnson.jpg" alt="Abdullah" className={styles.teamImage} />
                <div className={styles.teamContent}>
                  <h3>Abdullah</h3>
                  <p>Developer</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <p>&copy; 2024 SafeMail. All rights reserved.</p>
        </footer>
      </div>
    </body>
  );
};

export default Home;
