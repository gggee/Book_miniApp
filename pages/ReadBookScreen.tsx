import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

export default function ReadBookScreen({ route }) {
    const { previewLink } = route.params;

    const openBrowser = async () => {
        if (previewLink) {
            await WebBrowser.openBrowserAsync(previewLink);
        } else {
            Alert.alert('Error', 'No preview link available');
        }
    };

    useEffect(() => {
        openBrowser();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.message}>Opening book preview...</Text>
            <TouchableOpacity onPress={openBrowser} style={styles.button}>
                <Text style={styles.buttonText}>Open Book Preview</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9', 
        padding: 20,
    },
    message: {
        fontSize: 18,
        marginBottom: 20,
        color: '#2D241B', 
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#2D241B',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
