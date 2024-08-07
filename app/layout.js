"use client";

import { Inter } from "next/font/google";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; 
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/home');
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <html lang="en">
      <head>
        <title>Customer Support - SafeMail</title>
        <link rel="shortcut icon" href="https://cdn-icons-png.flaticon.com/512/3076/3076314.png" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}
