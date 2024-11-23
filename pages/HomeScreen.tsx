import React from 'react';
import { View, StyleSheet, Image, Dimensions, Text, ScrollView } from 'react-native';

const images = [
  {
    id: '1',
    uri: require('../assets/img/img2.jpg'),
    title: 'Books are more than just a collection of pages',
    description: 'They have the magical ability to transport us to different eras, cultures and fantasy worlds. Each book is the result of the creative work of the author, who puts his thoughts, feelings and ideas into his works.',
  },
  {
    id: '2',
    uri: require('../assets/img/img3.jpg'),
    title: 'Reading books develops imagination, improves concentration and memory.',
    description: 'It allows us to better understand human nature and expands our horizons. Books can inspire, educate and help cope with difficulties.',
  },
];

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {images.map((item) => (
        <View key={item.id} style={styles.itemContainer}>
          <Image source={item.uri} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
      ))}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
        Books remain an important part of our lives and culture. They help us understand the world, learn about the past and imagine the future. Each book is a unique journey worth taking. Whether you read in paper or electronic format, books remain an integral part of the human experience.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
  },
  itemContainer: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: Dimensions.get('window').width - 40,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  textContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    width: Dimensions.get('window').width - 40,
    alignSelf: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    backgroundColor: '#a9a59c',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
});
