import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const saveUserData = async (userData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const loginUser = async (userData) => {
    setUser(userData);
    await saveUserData(userData); 
  };

  const logoutUser = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user'); 
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
