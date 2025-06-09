import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseConfig from '../utils/firebaseConfig';

// Initialize Firebase (prevent multiple init in hot reload)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function WelcomePage({ onStart, onExit }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('deeplearnUserId');
    if (stored) {
      setUserId(stored);
    } else {
      const newId = uuidv4();
      localStorage.setItem('deeplearnUserId', newId);
      setUserId(newId);
    }
  }, []);

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'welcomeUsers'), {
        userId,
        firstName,
        lastName,
        age,
        grade,
        timestamp: new Date().toISOString()
      });
      onStart();
    } catch (err) {
      console.error('❌ Firebase welcome submission failed:', err);
      alert("There was a problem saving your info. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your return JSX stays the same
