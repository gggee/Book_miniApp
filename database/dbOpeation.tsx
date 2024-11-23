import { insertUser, getUserByEmail } from "./db";
export const addUser = async () => {
  try {
    const newUser = {
      name: '',
      categories: {
        reading: [],
        planned: [],
        dropped: [],
        read: [],
        favorite: []
      }
    };
    const result = await insertUser(newUser.name, newUser.categories);
    console.log('User added:', result);
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

export const fetchUser = async (userId) => {
  try {
    const user = await getUser(userId);
    console.log('User fetched:', user);
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

export const updateUserCategories = async (userId, newCategories) => {
  try {
    await updateUser(userId, newCategories);
    console.log('User updated:', userId);
  } catch (error) {
    console.error('Error updating user:', error);
  }
};
