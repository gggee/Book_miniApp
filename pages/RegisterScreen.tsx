import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Platform, ScrollView } from 'react-native';
import UserContext from '../context/UserContext';
import { insertUser } from '../database/db'; 

export default function RegisterScreen({ navigation }) {
  const { setUser } = useContext(UserContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      if (name.trim().length < 2) {
        Alert.alert('Ошибка', 'Имя пользователя должно содержать не менее 2 символов.');
        return;
      }
      if (password.length < 8) {
        Alert.alert('Ошибка', 'Пароль должен содержать не менее 8 символов.');
        return;
      }
      if (!email.endsWith('@gmail.com')) {
        Alert.alert('Ошибка', 'Введите адрес электронной почты с доменом @gmail.com.');
        return;
      }
      const newUserId = await insertUser(name, { reading: [], planned: [], dropped: [], read: [], favorite: [] });
      setUser({ id: newUserId, name, email, favoriteBooks: [] });

      navigation.navigate('Profile');
    } catch (error) {
      console.error('Ошибка при регистрации пользователя:', error);
      setError('Регистрация не удалась. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Регистрация</Text>
      <TextInput
        style={styles.input}
        placeholder="Имя пользователя"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Зарегистрироваться</Text>
      </TouchableOpacity>
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Уже есть аккаунт?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
          <Text style={styles.signInLink}>Войти в аккаунт</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 20,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#2d241b',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  signInText: {
    fontSize: 16,
    color: '#333',
  },
  signInLink: {
    color: '#86C232',
    marginTop: 5,
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});
