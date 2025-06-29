// screens/HypertensionPredictScreen.js
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
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const API_URL = 'https://walgar-hyper.hf.space'

const GENDER_OPTIONS = [
  { label: 'Male', value: 1 },
  { label: 'Female', value: 0 },
];

const SMOKING_HISTORY = [
  { label: 'Never', value: 0 },
  { label: 'Former', value: 1 },
  { label: 'Current', value: 2 },
];

const YES_NO_OPTIONS = [
  { label: 'No', value: 0 },
  { label: 'Yes', value: 1 },
];

export default function HypertensionPredictScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  
  const [formData, setFormData] = useState({
    gender: 1,
    age: '',
    diabetes: 0,
    heart_disease: 0,
    smoking_history: 0,
    bmi: '',
    HbA1c_level: '',
    blood_glucose_level: '',
  });

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

  const validateForm = () => {
    if (!formData.age || !formData.bmi || !formData.HbA1c_level || !formData.blood_glucose_level) {
      setError('Please fill in all fields');
      return false;
    }
    if (formData.age < 0 || formData.age > 120) {
      setError('Please enter a valid age');
      return false;
    }
    if (formData.bmi < 10 || formData.bmi > 50) {
      setError('Please enter a valid BMI (10-50)');
      return false;
    }
    if (formData.HbA1c_level < 3 || formData.HbA1c_level > 9) {
      setError('Please enter a valid HbA1c level (3-9%)');
      return false;
    }
    if (formData.blood_glucose_level < 50 || formData.blood_glucose_level > 300) {
      setError('Please enter a valid blood glucose level (50-300 mg/dL)');
      return false;
    }
    return true;
  };

 const handlePredict = async () => {
if (!validateForm()) return;

setLoading(true);
setError(null);
setPrediction(null);

try {
// Format data according to the PatientData schema
const requestData = {
gender: parseInt(formData.gender),
age: parseFloat(formData.age),
diabetes: parseInt(formData.diabetes),
heart_disease: parseInt(formData.heart_disease),
smoking_history: parseInt(formData.smoking_history),
bmi: parseFloat(formData.bmi),
HbA1c_level: parseFloat(formData.HbA1c_level),
blood_glucose_level: parseInt(formData.blood_glucose_level)
};

console.log('Sending request with data:', requestData);

const response = await axios.post(`${API_URL}/predict`, requestData, {
headers: {
'Content-Type': 'application/json',
},
});

console.log('Response:', response.data);

// Handle the response based on your API's response format
if (response.data) {
setPrediction({
hypertension: response.data.hypertension,
message: response.data.message
});
} else {
throw new Error('Invalid response format');
}

} catch (err) {
console.error('Full error:', err);
let errorMessage = 'Error during prediction. ';

if (err.response) {
console.error('Error response:', err.response.data);
if (err.response.status === 422) {
// Handle validation errors
const validationErrors = err.response.data.detail;
if (validationErrors && validationErrors.length > 0) {
errorMessage += validationErrors.map(error => error.msg).join('. ');
} else {
errorMessage += 'Invalid data format. Please check your inputs.';
}
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
    return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <MaterialCommunityIcons name="heart-pulse" size={32} color="#FF6B6B" />
        <Text style={styles.headerTitle}>Hypertension Risk Assessment</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.subtitle}>
          Please fill in your health information
        </Text>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.gender}
                onValueChange={(value) => setFormData({...formData, gender: value})}
                style={styles.picker}
              >
                {GENDER_OPTIONS.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              value={formData.age}
              onChangeText={(value) => setFormData({...formData, age: value})}
              keyboardType="numeric"
              placeholder="Enter your age"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Diabetes</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.diabetes}
                onValueChange={(value) => setFormData({...formData, diabetes: value})}
                style={styles.picker}
              >
                {YES_NO_OPTIONS.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Heart Disease</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.heart_disease}
                onValueChange={(value) => setFormData({...formData, heart_disease: value})}
                style={styles.picker}
              >
                {YES_NO_OPTIONS.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Smoking History</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.smoking_history}
                onValueChange={(value) => setFormData({...formData, smoking_history: value})}
                style={styles.picker}
              >
                {SMOKING_HISTORY.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>BMI</Text>
            <TextInput
              style={styles.input}
              value={formData.bmi}
              onChangeText={(value) => setFormData({...formData, bmi: value})}
              keyboardType="numeric"
              placeholder="Enter your BMI"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>HbA1c Level (%)</Text>
            <TextInput
              style={styles.input}
              value={formData.HbA1c_level}
              onChangeText={(value) => setFormData({...formData, HbA1c_level: value})}
              keyboardType="numeric"
              placeholder="Enter HbA1c level"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Blood Glucose Level (mg/dL)</Text>
            <TextInput
              style={styles.input}
              value={formData.blood_glucose_level}
              onChangeText={(value) => setFormData({...formData, blood_glucose_level: value})}
              keyboardType="numeric"
              placeholder="Enter blood glucose level"
            />
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert" size={24} color="#FF6B6B" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.predictButton, loading && styles.disabledButton]}
          onPress={handlePredict}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <MaterialCommunityIcons name="heart-pulse" size={24} color="#fff" />
              <Text style={styles.predictButtonText}>Analyze Risk</Text>
            </>
          )}
        </TouchableOpacity>

        {prediction && (
          <View style={[
            styles.resultContainer,
            { backgroundColor: prediction.hypertension ? '#FFE5E5' : '#E5F6FF' }
          ]}>
            <MaterialCommunityIcons 
              name={prediction.hypertension ? 'alert-circle' : 'check-circle'} 
              size={32} 
              color={prediction.hypertension ? '#FF6B6B' : '#4CAF50'} 
            />
            <Text style={[
              styles.resultText,
              { color: prediction.hypertension ? '#FF6B6B' : '#4CAF50' }
            ]}>
              {prediction.message}
            </Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <MaterialCommunityIcons name="information" size={24} color="#666" />
          <Text style={styles.infoText}>
            This assessment tool uses multiple health factors to estimate your risk of hypertension. 
            Results should be reviewed with a healthcare professional for proper diagnosis.
          </Text>
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Analyzing your data...</Text>
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
  formContainer: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
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
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    lineHeight: 24,
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

