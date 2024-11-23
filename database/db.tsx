import AsyncStorage from '@react-native-async-storage/async-storage';

export const insertUser = async (name, email, password) => {
  try {
    const user = { name, email, password };
    await AsyncStorage.setItem(`user_${email}`, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user data', error);
  }
};

export const getUserByEmail = async (email) => {
  try {
    const userJson = await AsyncStorage.getItem(`user_${email}`);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error retrieving user data', error);
    return null;
  }
};
