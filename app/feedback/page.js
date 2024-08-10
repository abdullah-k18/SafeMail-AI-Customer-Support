"use client";

import React, { useState, useEffect } from 'react';
import styles from './feedback.module.css';
import { db, auth, storage } from '../../firebase'; 
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { useRouter } from 'next/navigation';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profileImageUrl: '',
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.data();
        if (userDoc.exists()) {
          if (userData) {
            let profileImageUrl = '';
            if (userData.profileImageUrl) {
              const imageRef = ref(storage, userData.profileImageUrl);
              profileImageUrl = await getDownloadURL(imageRef);
            }

            setUserData({
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              profileImageUrl,
            });
          }
        }
        
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    try {
      await addDoc(collection(db, 'feedback'), {
        fullName: `${userData.firstName} ${userData.lastName}`,
        profileImageUrl: userData.profileImageUrl,
        rating,
        review,
        timestamp: new Date(),
      });
      setSuccess('Feedback submitted successfully');
      setRating(0);
      setReview('');
    } catch (error) {
      setError('Failed to submit feedback');
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
    setOverlayOpen(!overlayOpen);
  };

  const handleHomeClick = () => {
    router.push('/home');
  };

  const handleProfileClick = () => {
    router.push('/editProfile');
  };

  const handleRateClick = () => {
    router.push('/feedback');
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true); 
  };

  const confirmLogout = () => {
    auth.signOut().then(() => {
      router.push('/'); 
    }).catch((error) => {
      console.error('Logout Error:', error);
    });
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false); 
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setOverlayOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerOpen && !event.target.closest(`.${styles.drawer}`) && !event.target.closest(`.${styles.menuButton}`)) {
        closeDrawer();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [drawerOpen]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.menuButton} onClick={toggleDrawer}>
          &#9776;
        </div>
        <div className={styles.logo}>Welcome, {userData.firstName}</div>
        <div className={styles.headerprofileImageContainer}>
          {userData.profileImageUrl ? (
            <img src={userData.profileImageUrl} alt="Profile" className={styles.headerprofileImage} />
          ) : (
            <div className={styles.headerprofileImagePlaceholder}>No Image</div>
          )}
        </div>
      </header>
      <div className={`${styles.overlay} ${overlayOpen ? styles.open : ''}`} onClick={closeDrawer}></div>
      <div className={`${styles.drawer} ${drawerOpen ? styles.open : ''}`}>
        <div className={styles.drawerHeader}>MENU</div>
        <hr />
        <button onClick={handleHomeClick}>Home</button>
        <hr />
        <button onClick={handleProfileClick}>Profile</button>
        <hr />
        <button onClick={handleRateClick}>Feedback</button>
        <hr />
        <button onClick={handleLogoutClick}>Logout</button>
        <hr />
      </div>
      {showLogoutDialog && (
        <div className={styles.logoutDialog}>
          <p>Do you want to logout?</p>
          <button onClick={confirmLogout}>Yes</button>
          <button onClick={cancelLogout}>Cancel</button>
        </div>
      )}
      <div className={styles.container}>
        <h1 className={styles.heading}>Your Feedback Matters</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.rating}>
            <span className={styles.ratingLabel}>Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`${styles.star} ${rating >= star ? styles.filled : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            className={styles.textarea}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review here..."
            rows="5"
          />
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          <button type="submit" className={styles.submitButton}>Submit</button>
        </form>
      </div>
    </>
  );
};

export default Feedback;
