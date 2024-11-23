import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Button } from 'react-native';
import UserContext from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen () {
  const { user, logoutUser } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const [reading, setReading] = useState([]);
  const [dropped, setDropped] = useState([]);
  const [planned, setPlanned] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);

  useEffect(() => {
    const fetchCategory = async (category) => {
      try {
        const storedBooks = await AsyncStorage.getItem(`user_${category}`);
        return storedBooks ? JSON.parse(storedBooks) : [];
      } catch (error) {
        console.error(`Ошибка при получении ${category}:`, error);
        return [];
      }
    };

    const loadData = async () => {
      const fetchedFavorites = await fetchCategory('favorites');
      const fetchedReading = await fetchCategory('reading');
      const fetchedDropped = await fetchCategory('dropped');
      const fetchedPlanned = await fetchCategory('planned');

      setFavorites(fetchedFavorites);
      setReading(fetchedReading);
      setDropped(fetchedDropped);
      setPlanned(fetchedPlanned);

      const combinedBooks = [
        ...fetchedFavorites,
        ...fetchedReading,
        ...fetchedDropped,
        ...fetchedPlanned,
      ];

      const uniqueBooks = combinedBooks.reduce((acc, book) => {
        if (!acc.some(b => b.id === book.id)) {
          acc.push(book);
        }
        return acc;
      }, []);
      
      setAllBooks(uniqueBooks);
    };

    loadData();
  }, [user]);

  const getBookCategory = (book) => {
    if (favorites.some(b => b.id === book.id)) return t('profile.favorites');
    if (reading.some(b => b.id === book.id)) return t('profile.reading');
    if (planned.some(b => b.id === book.id)) return t('profile.planned');
    if (dropped.some(b => b.id === book.id)) return t('profile.dropped');
    return t('profile.unknown');
  };

  const handleRemoveBook = async (book, category) => {
    try {
      const categoryKey = `user_${category}`;
      const storedBooks = await AsyncStorage.getItem(categoryKey);
      let books = storedBooks ? JSON.parse(storedBooks) : [];
      books = books.filter(b => b.id !== book.id);
      await AsyncStorage.setItem(categoryKey, JSON.stringify(books));
      if (category === 'favorites') setFavorites(books);
      if (category === 'reading') setReading(books);
      if (category === 'dropped') setDropped(books);
      if (category === 'planned') setPlanned(books);
      setAllBooks(prevBooks => prevBooks.filter(b => b.id !== book.id));
    } catch (error) {
      console.error(`Ошибка при удалении книги из ${category}:`, error);
    }
  };

  const renderBookItem = ({ item, category }) => (
    <View style={styles.bookItem}>
      {item.volumeInfo?.imageLinks?.thumbnail ? (
        <Image source={{ uri: item.volumeInfo.imageLinks.thumbnail }} style={styles.coverImage} />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Text style={styles.coverText}>{t('profile.noImage')}</Text>
        </View>
      )}
      <Text style={styles.title}>{item.volumeInfo?.title}</Text>
      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveBook(item, category)}>
        <Text style={styles.removeButtonText}>{t('profile.remove')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCategory = (title) => (
    <TouchableOpacity
      style={[styles.categoryButton, selectedCategory === title && styles.selectedCategory]}
      onPress={() => setSelectedCategory(title)}
    >
      <View style={styles.categoryContent}>
        <Text style={styles.categoryTitle}>{title}</Text>
        {title === 'Все' && <Text style={styles.categoryCount}>{` (${allBooks.length})`}</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderBooksGrid = (data, category) => {
    if (data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('profile.noBooks')}</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderBookItem({ item, category })}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.bookList}
      />
    );
  };

  const handleLogout = async () => {
    await logoutUser();
    navigation.navigate('SignInScreen');
  };

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    setLanguageModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="user" size={30} color="#333" style={styles.icon} />
        {user?.name ? (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{t('profile.welcome')} {user.name}!</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setLanguageModalVisible(true)}
              >
                <Icon name="globe" size={25} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleLogout}
              >
                <Icon name="sign-out" size={25} color="#333" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.userName}>{t('profile.welcome')} User!</Text>
        )}
      </View>
      <ScrollView horizontal style={styles.categoryScroll}>
        <View style={styles.categoryContainer}>
          {renderCategory(t('profile.all'))}
          {renderCategory(t('profile.favorites'))}
          {renderCategory(t('profile.reading'))}
          {renderCategory(t('profile.planned'))}
          {renderCategory(t('profile.dropped'))}
        </View>
      </ScrollView>
      <View style={styles.booksContainer}>
        {selectedCategory === t('profile.all') && renderBooksGrid(allBooks, 'all')}
        {selectedCategory === t('profile.favorites') && renderBooksGrid(favorites, 'favorites')}
        {selectedCategory === t('profile.reading') && renderBooksGrid(reading, 'reading')}
        {selectedCategory === t('profile.planned') && renderBooksGrid(planned, 'planned')}
        {selectedCategory === t('profile.dropped') && renderBooksGrid(dropped, 'dropped')}
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isLanguageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('profile.selectLanguage')}</Text>
            <Button title="English" onPress={() => handleLanguageChange('en')} />
            <Button title="Русский" onPress={() => handleLanguageChange('ru')} />
            <Button title="Қазақша" onPress={() => handleLanguageChange('kk')} />
            <Button title={t('profile.close')} onPress={() => setLanguageModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#a9a59c',
    backgroundColor: '#ffffff',
  },
  icon: {
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
  categoryScroll: {
    flexDirection: 'row',
    paddingVertical: 5,
    overflow: 'hidden',
    maxHeight: 80,
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    width: 140,
    height: 70,
    paddingVertical: 10,
    marginRight: 5,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#d0d0d0',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 16,
  },
  categoryCount: {
    fontSize: 14,
    color: '#888888',
  },
  booksContainer: {
    flex: 1,
    padding: 10,
  },
  bookItem: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    padding: 10,
    alignItems: 'center',
  },
  coverImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  coverPlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#cccccc',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverText: {
    color: '#ffffff',
    fontSize: 14,
  },
  title: {
    fontSize: 16,
    marginVertical: 5,
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: '#2d241b',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
  },
  row: {
    justifyContent: 'space-between',
  },
  bookList: {
    flexGrow: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});
