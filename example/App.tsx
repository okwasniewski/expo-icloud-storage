import { StatusBar } from 'expo-status-bar';
import iCloudStorage from 'expo-icloud-storage';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';

export default function App() {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [allKeys, setAllKeys] = useState<string[]>([]);

  const handleSet = () => {
    if (!key || !value) {
      Alert.alert('Error', 'Please enter both key and value');
      return;
    }
    iCloudStorage.set(key, value);
    setResult(`Saved: ${key} = ${value}`);
  };

  const handleGet = () => {
    if (!key) {
      Alert.alert('Error', 'Please enter a key');
      return;
    }
    const stored = iCloudStorage.getString(key);
    setResult(stored ? `Value: ${stored}` : 'Key not found');
  };

  const handleRemove = () => {
    if (!key) {
      Alert.alert('Error', 'Please enter a key');
      return;
    }
    iCloudStorage.remove(key);
    setResult(`Removed: ${key}`);
  };

  const handleGetAllKeys = () => {
    const keys = iCloudStorage.getAllKeys();
    setAllKeys(keys);
    setResult(`Found ${keys.length} keys`);
  };

  if (Platform.OS !== 'ios' && Platform.OS !== 'macos') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>expo-icloud-storage</Text>
        <Text style={styles.unsupported}>
          iCloud storage is only available on Apple platforms
        </Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>expo-icloud-storage</Text>
      <Text style={styles.subtitle}>iCloud Key-Value Storage Demo</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Key"
          value={key}
          onChangeText={setKey}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Value"
          value={value}
          onChangeText={setValue}
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleSet}>
          <Text style={styles.buttonText}>Set</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleGet}>
          <Text style={styles.buttonText}>Get</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRemove}>
          <Text style={styles.buttonText}>Remove</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.fullWidth]}
        onPress={handleGetAllKeys}
      >
        <Text style={styles.buttonText}>Get All Keys</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}

      {allKeys.length > 0 && (
        <View style={styles.keysContainer}>
          <Text style={styles.keysTitle}>Stored Keys:</Text>
          {allKeys.map((k, index) => (
            <Text key={index} style={styles.keyItem}>
              • {k}
            </Text>
          ))}
        </View>
      )}

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  unsupported: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  fullWidth: {
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e8f4e8',
    borderRadius: 8,
    width: '100%',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  keysContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  keysTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  keyItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});
