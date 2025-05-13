import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';


export default function HomeScreen() {
  const [application, setApplication] = useState('');
  const [password, setPassword] = useState('');
  const [entries, setEntries] = useState<{ app: string; password: string }[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  // Load saved entries
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const saved = await AsyncStorage.getItem('entries');
        if (saved) {
          setEntries(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Failed to load entries', err);
      }
    };

    loadEntries();
  }, []);

  // Save a new entry
  const saveEntry = async () => {
    if (!application.trim() || !password.trim()) {
      Alert.alert('Missing Info', 'Please fill in both fields.');
      return;
    }

    const newEntry = { app: application, password };
    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    setApplication('');
    setPassword('');

    try {
      await AsyncStorage.setItem('entries', JSON.stringify(updatedEntries));
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  // Remove an entry
  const removeEntry = async (index: number) => {
    const filtered = entries.filter((_, i) => i !== index);
    setEntries(filtered);
    try {
      await AsyncStorage.setItem('entries', JSON.stringify(filtered));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔐 Password Manager</Text>

      <TextInput
        style={styles.input}
        placeholder="Application name"
        placeholderTextColor="#999"
        value={application}
        onChangeText={setApplication}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#555" />
        </TouchableOpacity>
      </View>

      <Button title="Save Entry" onPress={saveEntry} color="#007AFF" />

      <FlatList
        data={entries}
        keyExtractor={(_, i) => i.toString()}
        style={{ marginTop: 20 }}
        renderItem={({ item, index }) => (
          <View style={styles.entry}>
            <Text style={styles.entryText}>
              <Text style={styles.appName}>{item.app}</Text>: {item.password}
            </Text>
            <TouchableOpacity onPress={() => removeEntry(index)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  entry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  entryText: {
    fontSize: 16,
    color: '#333',
  },
  appName: {
    fontWeight: 'bold',
    color: '#111',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});
