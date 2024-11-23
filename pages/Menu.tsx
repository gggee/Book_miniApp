import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import UserContext from '../context/UserContext';

export default function Menu() {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  return (
    <View style={styles.topMenu}>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => navigation.navigate(user ? 'Profile' : 'Register')}
      >
        <Ionicons name="person" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Search')}>
        <Ionicons name="search" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#a9a59c', 
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingBottom:10
  },
});
