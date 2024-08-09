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
        <link rel="shortcut icon" href="https://cdn3.iconfinder.com/data/icons/antivirus-internet-security-thick-colored-version/33/email_scanning-512.png" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}
