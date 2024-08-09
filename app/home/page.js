"use client";

import { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import styles from './home.module.css';
import { auth, db, storage } from '../../firebase';
import { Box, IconButton, Stack, TextField, Avatar } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

const Home = () => {
  const [userData, setUserData] = useState({ firstName: '', profileImageUrl: '' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm the SafeMail Customer Support Assistant. How can I help you today?",
      profilePic: "https://www.shutterstock.com/image-vector/call-center-customer-support-vector-600nw-2285364015.jpg",
    },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    setLoading(true);
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message, profilePic: userData.profileImageUrl },
      { role: "assistant", content: "", profilePic: "https://www.shutterstock.com/image-vector/call-center-customer-support-vector-600nw-2285364015.jpg" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content: "I'm sorry, but I encountered an error. Please try again later.",
          profilePic: "https://www.shutterstock.com/image-vector/call-center-customer-support-vector-600nw-2285364015.jpg",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
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
              profileImageUrl,
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        router.push('/'); 
      }
    };

    fetchUserData();
  }, [router]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
    setOverlayOpen(!overlayOpen);
  };

  const handleHomeClick = () => {
    router.push('/home')
  };

  const handleProfileClick = () => {
    router.push('/editProfile')
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
      <div className={styles.container}>
      <Box
      maxWidth="100vw"
      maxHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        padding: 2,
      }}
    >
      <Stack
        direction={"column"}
        width={{ xs: "90%", sm: "1000px" }}
        height={{ xs: "80vh", sm: "600px" }}
        borderRadius={2}
        boxShadow={3}
        p={3}
        spacing={3}
        bgcolor="black"
      >
        <Stack
          direction={"column"}
          spacing={2}
          flexGrow={1}
          p={3}
          overflow="auto"
          maxHeight="100%"
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#333",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#555",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#777",
            },
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
              alignItems="center"
            >
              {message.role === "assistant" && (
                <Avatar
                  src={message.profilePic}
                  alt="Assistant"
                  sx={{ marginRight: 1 }}
                />
              )}
              <Box
                sx={{
                  backgroundColor:
                    message.role === "assistant" ? "#333" : "#005bb5",
                  color: "white",
                  borderRadius: "12px",
                  p: 2,
                  maxWidth: "80%",
                }}
              >
                {message.content}
              </Box>
              {message.role === "user" && (
                <Avatar
                  src={userData.profileImageUrl}
                  alt="User"
                  sx={{ marginLeft: 1 }}
                />
              )}
            </Box>
          ))}
        </Stack>
        <Stack direction={"row"} spacing={2}>
          <TextField
            placeholder="Type your message..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: 2,
                backgroundColor: "#333",
                color: "#fff",
              },
            }}
            InputLabelProps={{
              sx: { color: "#777" },
              borderColor: "transparent",
            }}
          />
          <IconButton
            onClick={sendMessage}
            sx={{
              borderRadius: 50,
              color: "#fff",
            }}
          >
            <SendIcon></SendIcon>
          </IconButton>
        </Stack>
      </Stack>
    </Box>
      </div>
    </>
  );
};

export default Home;
