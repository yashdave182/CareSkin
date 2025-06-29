import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ✅ Hugging Face API endpoint
const API_URL = 'https://walgar-skin-2.hf.space/predict';

// ✅ Correct resizing and center cropping
const processImage = async (uri) => {
  const cropped = await ImageManipulator.manipulateAsync(uri, [
    { resize: { width: 224, height: 224 } }
  ], {
    format: ImageManipulator.SaveFormat.JPEG,
    compress: 1
  });

  return cropped;
};

export default function DiseasePredictScreen() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadAnimation] = useState(new Animated.Value(1));

  const animateUploadBox = () => {
    Animated.sequence([
      Animated.timing(uploadAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(uploadAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const pickImage = async () => {
    setResult(null);
    setRaw(null);
    animateUploadBox();
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission required to access images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ compatible with all versions
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image Picker Error:', error);
      Alert.alert('Error', 'Error selecting image');
    }
  };

  const predict = async () => {
    if (!image) return;

    setLoading(true);
    setResult(null);
    setRaw(null);

    try {
      const processedImage = await processImage(image);
      const formData = new FormData();
      formData.append('file', {
        uri: processedImage.uri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();
      setRaw(JSON.stringify(data, null, 2));

      if (!data.success) {
        throw new Error(data.error || 'Prediction failed');
      }

      if (Array.isArray(data.predictions)) {
        const formatted = data.predictions
          .map((p) => `${p.class}: ${(p.confidence * 100).toFixed(2)}%`)
          .join('\n');
        setResult(formatted);
      } else {
        setResult(JSON.stringify(data.predictions));
      }
    } catch (error) {
      console.error('Prediction error:', error);
      Alert.alert('Prediction Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="medical-bag" size={28} color="#FF6B6B" />
          <Text style={styles.title}>Skin Disease Prediction</Text>
        </View>

        <Text style={styles.subtitle}>
          Upload a clear image of the skin condition. The model will analyze and predict.
        </Text>

        <Animated.View style={[styles.uploadContainer, { transform: [{ scale: uploadAnimation }] }]}>
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage} activeOpacity={0.8}>
            {image ? (
              <>
                <Image source={{ uri: image }} style={styles.uploadedImage} />
                <View style={styles.imageOverlay}>
                  <Text style={styles.changeImageText}>Change Image</Text>
                </View>
              </>
            ) : (
              <View style={styles.uploadContent}>
                <MaterialCommunityIcons name="image-plus" size={40} color="#AAAAAA" />
                <Text style={styles.uploadText}>Choose Image</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={[styles.predictBtn, (!image || loading) && styles.predictBtnDisabled]}
          onPress={predict}
          disabled={!image || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons name="brain" size={20} color="#fff" />
              <Text style={styles.predictBtnText}>Analyze Image</Text>
            </>
          )}
        </TouchableOpacity>

        {result && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Prediction Result</Text>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        )}

        {raw && (
          <View style={styles.rawBox}>
            <Text style={styles.rawTitle}>Raw Response</Text>
            <Text style={styles.rawText}>{raw}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flexGrow: 1, padding: 20, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginLeft: 10, color: '#444' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  uploadContainer: { marginBottom: 20 },
  uploadBox: {
    height: 220,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: { fontSize: 16, fontWeight: '600', marginTop: 10 },
  uploadedImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeImageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  predictBtn: {
    flexDirection: 'row',
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  predictBtnDisabled: {
    backgroundColor: '#ccc',
  },
  predictBtnText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  resultBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 20,
  },
  resultTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  rawBox: {
    backgroundColor: '#f9f9f9',
    marginTop: 16,
    padding: 10,
    borderRadius: 10,
  },
  rawTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  rawText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    color: '#666',
  }
});