"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import './globals.css';

const Home = () => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleSignupClick = () => {
    router.push('/signup');
  };

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
            <div className={styles.reviewCard}>
              <img src="/userA.jpg" alt="User A" className={styles.reviewImage} />
              <div className={styles.reviewContent}>
                <p>"blahblahblah"</p>
                <div className={styles.stars}>
                  ★★★★☆
                </div>
                <span>- User A</span>
              </div>
            </div>
            <div className={styles.reviewCard}>
              <img src="/userB.jpg" alt="User B" className={styles.reviewImage} />
              <div className={styles.reviewContent}>
                <p>"blahblahblah"</p>
                <div className={styles.stars}>
                  ★★★★★
                </div>
                <span>- User B</span>
              </div>
            </div>
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