import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Alert, ScrollView, SafeAreaView, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import UserContext from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export default function BookScreen({ route, navigation }) {
  const { book } = route.params;
  const { user, setUser } = useContext(UserContext);
  const { t } = useTranslation();
  const [category, setCategory] = useState('favorites');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const lastTap = useRef(0);

  useEffect(() => {
    const checkBookCategory = async () => {
      const categories = ['favorites', 'reading', 'planned', 'dropped'];
      for (const cat of categories) {
        const storedBooks = await AsyncStorage.getItem(`user_${cat}`);
        const books = storedBooks ? JSON.parse(storedBooks) : [];
        if (books.some(b => b.id === book.id)) {
          setCategory(cat);
          break;
        }
      }
    };
    checkBookCategory();
  }, [book.id]);

  const handleReadBook = () => {
    const previewLink = book?.volumeInfo?.previewLink;
    if (previewLink) {
      navigation.navigate('ReadBookScreen', { previewLink });
    } else {
      Alert.alert(t('book.noPreview'), '');
    }
  };

  const handleAddToCategory = async () => {
    try {
      const categories = ['favorites', 'reading', 'planned', 'dropped'];
      for (const cat of categories) {
        const storedBooks = await AsyncStorage.getItem(`user_${cat}`);
        const books = storedBooks ? JSON.parse(storedBooks) : [];
        const updatedBooks = books.filter(b => b.id !== book.id);
        await AsyncStorage.setItem(`user_${cat}`, JSON.stringify(updatedBooks));
      }

      const updatedCategoryList = [...(user[category] || []), book];
      await AsyncStorage.setItem(`user_${category}`, JSON.stringify(updatedCategoryList));

      if (setUser) {
        setUser({ ...user, [category]: updatedCategoryList });
      }

      Alert.alert(t('book.added'), `${t('book.addToCategory')} ${category}!`);
    } catch (error) {
      console.error('Error adding to category:', error);
      Alert.alert(t('error'), t('book.addError'));
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTap.current && (now - lastTap.current) < DOUBLE_TAP_DELAY) {
      handleModalClose();
    }
    lastTap.current = now;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={{ uri: book.volumeInfo?.imageLinks?.thumbnail }}
          style={styles.coverImage}
        />
        <Text style={styles.title}>{book.volumeInfo?.title}</Text>
        <Text style={styles.author}>{book.volumeInfo?.authors?.join(', ')}</Text>
        <Text style={styles.description}>{book.volumeInfo?.description}</Text>

        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={[styles.button, styles.addButton]}>
          <Text style={styles.buttonText}>{t('book.addToCategory')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReadBook} style={[styles.button, styles.readButton]}>
          <Text style={styles.buttonText}>{t('book.read')}</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleModalClose}
      >
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label={t('modal.favorites')} value="favorites" />
                  <Picker.Item label={t('modal.reading')} value="reading" />
                  <Picker.Item label={t('modal.planned')} value="planned" />
                  <Picker.Item label={t('modal.dropped')} value="dropped" />
                </Picker>
                <TouchableOpacity onPress={handleAddToCategory} style={styles.addButton}>
                  <Text style={styles.buttonText}>{t('modal.addButton')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  coverImage: {
    width: 150,
    height: 200,
    alignSelf: 'center',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2D241B',
  },
  author: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#2D241B',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
    color: '#2D241B',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2D241B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  readButton: {
    backgroundColor: '#222629',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    height: '40%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#2D241B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 150,
  },
});
