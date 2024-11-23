import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import BookService from '../service/BookService';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; 

export default function SearchScreen() {
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [author, setAuthor] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchInitialBooks();
    }, []);

    const fetchInitialBooks = async () => {
        try {
            const books = await BookService.fetchBooks('game', 40);
            setResults(books);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const query = `${title ? `intitle:${title}` : ''}${author ? `+inauthor:${author}` : ''}${genre ? `+subject:${genre}` : ''}` || 'game';
            const books = await BookService.fetchBooks(query, 40);
            setResults(books);
        } catch (error) {
            console.error('Error searching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePress = (book) => {
        navigation.navigate('BookScreen', { book });
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    onChangeText={text => setTitle(text)}
                    value={title}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Genre"
                    onChangeText={text => setGenre(text)}
                    value={genre}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Author"
                    onChangeText={text => setAuthor(text)}
                    value={author}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.bookItem} onPress={() => handlePress(item)}>
                            {item.volumeInfo?.imageLinks?.thumbnail ? (
                                <Image
                                    source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                                    style={styles.bookImg}
                                />
                            ) : (
                                <View style={styles.bookImgPlaceholder}>
                                    <Icon name="book" size={50} color="#888" />
                                </View>
                            )}
                            <Text style={styles.bookTitle}>{item.volumeInfo.title}</Text>
                            <Text style={styles.bookAuthor}>{item.volumeInfo.authors?.join(', ')}</Text>
                            <Text style={styles.bookGenre}>{item.volumeInfo.categories?.join(', ') || 'No Genre'}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.bookList}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    searchContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        flex: 1,
        marginRight: 10,
        borderRadius: 5,
    },
    searchButton: {
        backgroundColor: '#2d241b',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    bookList: {
        padding: 5,
    },
    bookItem: {
        flex: 1,
        margin: 5,
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        overflow: 'hidden',
    },
    bookImg: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
        borderRadius: 15
    },
    bookImgPlaceholder: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
        marginBottom: 10,
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    bookAuthor: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
        textAlign: 'center',
    },
    bookGenre: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
    },
});
