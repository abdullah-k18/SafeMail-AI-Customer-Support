"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import styles from './login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/home');
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>SafeMail</div>
        <nav className={styles.nav}>
          <a href="/" className={styles.navItem}>Home</a>
          <a href="/#reviews" className={styles.navItem}>Reviews</a>
          <a href="/#team" className={styles.navItem}>Our Team</a>
        </nav>
      </header>
      <h1 className={styles.title}>Login</h1>
      <form className={styles.form} onSubmit={handleLogin}>
        <label className={styles.label}>Email</label>
        <input
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className={styles.label}>Password</label>
        <input
          type="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button}>Login</button>
        <p className={styles.signupPrompt}>
          Don't have an account?{' '}
          <button className={styles.signupButton} onClick={() => router.push('/signup')}>
            Signup
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
