"use client";

import { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import styles from './home.module.css';
import { auth, db, storage } from '../../firebase';

const Home = () => {
  const [userData, setUserData] = useState({ firstName: '', profileImageUrl: '' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.data();

          if (userData) {
            let profileImageUrl = '';
            if (userData.profileImageUrl) {
              const imageRef = ref(storage, userData.profileImageUrl);
              profileImageUrl = await getDownloadURL(imageRef);
            }

            setUserData({
              firstName: userData.firstName || '',
              profileImageUrl,
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        router.push('/login'); 
      }
    };

    fetchUserData();
  }, [router]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
    setOverlayOpen(!overlayOpen);
  };

  const handleProfileClick = () => {
  };

  const handleRateClick = () => {
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
        <div className={styles.profileImageContainer}>
          {userData.profileImageUrl ? (
            <img src={userData.profileImageUrl} alt="Profile" className={styles.profileImage} />
          ) : (
            <div className={styles.profileImagePlaceholder}>No Image</div>
          )}
        </div>
      </header>
      <div className={`${styles.overlay} ${overlayOpen ? styles.open : ''}`} onClick={closeDrawer}></div>
      <div className={`${styles.drawer} ${drawerOpen ? styles.open : ''}`}>
        <div className={styles.drawerHeader}>MENU</div>
        <button onClick={handleProfileClick}>Profile</button>
        <button onClick={handleRateClick}>Rate</button>
        <button onClick={handleLogoutClick}>Logout</button>
      </div>
      {showLogoutDialog && (
        <div className={styles.logoutDialog}>
          <p>Do you want to logout?</p>
          <button onClick={confirmLogout}>Yes</button>
          <button onClick={cancelLogout}>Cancel</button>
        </div>
      )}
      <div className={styles.container}>
        {/* Your main content here */}
      </div>
    </>
  );
};

export default Home;
