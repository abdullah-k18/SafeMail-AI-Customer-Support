"use client";

import React, { useState, useEffect } from 'react';
import styles from './EditProfile.module.css';
import { auth, db, storage } from '../../firebase'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/navigation';

const EditProfile = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profileImageUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const closeDrawer = () => {
    setDrawerOpen(false);
    setOverlayOpen(false);
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

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
    setOverlayOpen(!overlayOpen);
  };

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
              lastName: userData.lastName || '',
              email: auth.currentUser.email || '',
              profileImageUrl
            });

            setFirstName(userData.firstName || '');
            setLastName(userData.lastName || '');
          }
        } catch (error) {
          setError('Error fetching user data.');
          console.error('Error fetching user data:', error);
        }
      } else {
        router.push('/');
      }
    };

    fetchUserData();
  }, [router]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFirstName(userData.firstName);
    setLastName(userData.lastName);
    setProfileImage(null);
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);

      let profileImageUrl = userData.profileImageUrl;
      if (profileImage) {
        const imageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
        await uploadBytes(imageRef, profileImage);
        profileImageUrl = await getDownloadURL(imageRef);
      }

      await updateDoc(userDocRef, {
        firstName,
        lastName,
        profileImageUrl
      });

      setUserData({
        ...userData,
        firstName,
        lastName,
        profileImageUrl
      });

      setLoading(false);
      setIsEditing(false);
    } catch (error) {
      setLoading(false);
      setError('Error updating profile.');
      console.error('Error updating profile:', error);
    }
  };

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
        <hr></hr>
        <button onClick={handleHomeClick}>Home</button>
        <hr></hr>
        <button onClick={handleProfileClick}>Profile</button>
        <hr></hr>
        <button onClick={handleRateClick}>Feedback</button>
        <hr></hr>
        <button onClick={handleLogoutClick}>Logout</button>
        <hr></hr>
      </div>
      {showLogoutDialog && (
        <div className={styles.logoutDialog}>
          <p>Do you want to logout?</p>
          <button onClick={confirmLogout}>Yes</button>
          <button onClick={cancelLogout}>Cancel</button>
        </div>
      )}
      <div className={styles.body}>
        <div className={styles.container}>
          {error && <p className={styles.error}>{error}</p>}
          {isEditing ? (
            <div className={styles.editProfileContainer}>
              <div className={styles.imageContainer}>
                {userData.profileImageUrl ? (
                  <img src={userData.profileImageUrl} alt="Profile" className={styles.profileImage} />
                ) : (
                  <div className={styles.profileImagePlaceholder}>No Image</div>
                )}
                <input type="file" className={styles.input} onChange={handleImageChange} />
              </div>
              <form className={styles.detailsContainer}>
                <label className={styles.label}>First Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <label className={styles.label}>Last Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <div className={styles.buttons}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={styles.saveButton}
                    onClick={handleUpdateProfile}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className={styles.profileContainer}>
              <div className={styles.imageContainer}>
                {userData.profileImageUrl ? (
                  <img src={userData.profileImageUrl} alt="Profile" className={styles.profileImage} />
                ) : (
                  <div className={styles.profileImagePlaceholder}>No Image</div>
                )}
              </div>
              <form className={styles.detailsContainer}>
                <label className={styles.label}>First Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={userData.firstName}
                  readOnly
                />
                <label className={styles.label}>Last Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={userData.lastName}
                  readOnly
                />
                <label className={styles.label}>Email</label>
                <input
                  type="text"
                  className={styles.input}
                  value={userData.email}
                  readOnly
                />
                <button className={styles.editButton} type="button" onClick={handleEditClick}>Edit Profile</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditProfile;
