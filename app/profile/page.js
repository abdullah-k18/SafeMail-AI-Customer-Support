"use client";

import React, { useState } from 'react';
import styles from './profile.module.css';
import { auth, db, storage } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // Added success message state
  const router = useRouter();

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (profileImage) {
        const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, profileImage);
      }

      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        firstName,
        lastName,
        profileImageUrl: profileImage ? `profile_images/${auth.currentUser.uid}` : null
      });

      setSuccessMessage('Profile saved successfully!'); // Set success message
      setError('');
    } catch (error) {
      setError('Failed to save profile. Please try again.');
      setSuccessMessage(''); // Clear success message on error
    }
  };

  const handleRedirectToLogin = () => {
    router.push('/login');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <body className={styles.body}>
      <div className={styles.container}>
        <h1 className={styles.title}>Set Profile</h1>

        <div className={styles.imageContainer}>
          {imagePreview ? (
            <img src={imagePreview} alt="Profile Preview" className={styles.profileImage} />
          ) : (
            <div className={styles.profileImagePlaceholder}>Choose Photo</div>
          )}
        </div>

        <form className={styles.form} onSubmit={handleSave}>
          <label className={styles.label}>First Name</label>
          <input
            type="text"
            className={styles.input}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label className={styles.label}>Last Name</label>
          <input
            type="text"
            className={styles.input}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <label className={styles.label}>Profile Photo</label>
          <input
            type="file"
            className={styles.input}
            onChange={handleImageChange}
          />

          {error && <p className={styles.error}>{error}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>} {/* Display success message */}

          <button type="submit" className={styles.button}>Save</button>

          <button
            type="button"
            className={styles.redirectButton}
            onClick={handleRedirectToLogin}
          >
            <span className={styles.arrow}>→</span> Continue to Login
          </button>
        </form>
      </div>
    </body>
  );
};

export default Profile;
