// screens/LungCancerPredictScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const { width } = Dimensions.get('window');
const API_URL = 'https://walgar-lung.hf.space';

function LungCancerPredictScreen() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    testAPI();
  }, []);

  const testAPI = async () => {
    try {
      const response = await axios.get(`${API_URL}/`);
      console.log('API health check:', response.data);
      return true;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setPrediction(null);
        setError(null);
      }
    } catch (err) {
      setError('Error picking image');
      console.error('Error picking image:', err);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setError('Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setPrediction(null);
        setError(null);
      }
    } catch (err) {
      setError('Error taking photo');
      console.error('Error taking photo:', err);
    }
  };

  const predictImage = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Create form data
      const formData = new FormData();
      
      // Add the image file to form data
      formData.append('file', {
        uri: image,
        type: 'image/jpeg',
        name: 'image.jpg',
      });

      console.log('Sending request to:', `${API_URL}/predict`);

      const result = await axios.post(`${API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        transformRequest: (data, headers) => {
          return formData;
        },
      });

      console.log('Response:', result.data);

      if (result.data) {
        const predictionResult = {
          class: result.data.class || result.data.prediction || result.data,
          confidence: result.data.confidence || result.data.probability || 1.0
        };
        setPrediction(predictionResult);
      } else {
        throw new Error('Invalid response format');
      }

    } catch (err) {
      console.error('Full error:', err);
      let errorMessage = 'Error during prediction. ';

      if (err.response) {
        console.error('Error response:', err.response.data);
        if (err.response.status === 422) {
          errorMessage += 'Invalid image format or file. Please try another image.';
        } else {
          errorMessage += 'Server error occurred. Please try again.';
        }
      } else if (err.request) {
        errorMessage += 'Could not connect to server. Please check your internet connection.';
      } else {
        errorMessage += err.message || 'Unknown error occurred.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPredictionColor = (predictionClass) => {
    switch (predictionClass) {
      case 'Normal':
        return '#4CAF50';
      case 'Benign':
        return '#FFA726';
      case 'Malignant':
        return '#FF5252';
      default:
        return '#333';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <MaterialCommunityIcons name="lungs" size={32} color="#FF6B6B" />
        <Text style={styles.headerTitle}>Lung Cancer Detection</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.subtitle}>
          Upload or take a CT scan image for analysis
        </Text>

        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.selectedImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <MaterialCommunityIcons name="image-plus" size={48} color="#666" />
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.galleryButton]} 
            onPress={pickImage}
          >
            <MaterialCommunityIcons name="image" size={24} color="#fff" />
            <Text style={styles.buttonText}>Choose Image</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.cameraButton]} 
            onPress={takePhoto}
          >
            <MaterialCommunityIcons name="camera" size={24} color="#fff" />
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        {image && (
          <TouchableOpacity
            style={[styles.predictButton, loading && styles.disabledButton]}
            onPress={predictImage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="brain" size={24} color="#fff" />
                <Text style={styles.predictButtonText}>Analyze Image</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert" size={24} color="#FF6B6B" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {prediction && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Analysis Result</Text>
            <View style={[
              styles.resultBadge,
              { backgroundColor: getPredictionColor(prediction.class) + '20' }
            ]}>
              <Text style={[
                styles.resultText,
                { color: getPredictionColor(prediction.class) }
              ]}>
                {prediction.class}
              </Text>
            </View>
            
            <View style={styles.confidenceBar}>
              <View style={[
                styles.confidenceFill,
                { 
                  width: `${prediction.confidence * 100}%`,
                  backgroundColor: getPredictionColor(prediction.class)
                }
              ]} />
            </View>
            
            <Text style={styles.confidenceText}>
              Confidence: {(prediction.confidence * 100).toFixed(1)}%
            </Text>

            <View style={styles.resultInfo}>
              <MaterialCommunityIcons 
                name={prediction.class === 'Normal' ? 'check-circle' : 'alert-circle'} 
                size={24} 
                color={getPredictionColor(prediction.class)} 
              />
              <Text style={styles.resultInfoText}>
                {prediction.class === 'Normal' 
                  ? 'No signs of lung cancer detected.' 
                  : prediction.class === 'Benign'
                  ? 'Benign abnormality detected. Consult a doctor for evaluation.'
                  : 'Potential malignancy detected. Immediate medical consultation recommended.'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.infoContainer}>
          <MaterialCommunityIcons name="information" size={24} color="#666" />
          <Text style={styles.infoText}>
            This AI tool analyzes CT scan images to detect potential signs of lung cancer. 
            Results should be reviewed by a healthcare professional for proper diagnosis. 
            The system can detect Normal, Benign, and Malignant cases.
          </Text>
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Processing image...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: width * 0.8,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  galleryButton: {
    backgroundColor: '#FF6B6B',
  },
  cameraButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  predictButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  predictButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#FF6B6B',
    marginLeft: 8,
    flex: 1,
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultBadge: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  confidenceBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
  },
  resultInfoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    lineHeight: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default LungCancerPredictScreen;
    