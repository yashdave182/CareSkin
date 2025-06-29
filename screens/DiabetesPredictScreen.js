import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const initialFields = {
  pregnancies: "",
  glucose: "",
  bloodpressure: "",
  skinthickness: "",
  insulin: "",
  bmi: "",
  dpf: "",
  age: "",
};

const fieldLabels = [
  { 
    key: "pregnancies", 
    label: "Pregnancies", 
    max: 20, 
    placeholder: "0-20",
    icon: "human-pregnant",
    unit: "times"
  },
  { 
    key: "glucose", 
    label: "Glucose", 
    max: 300, 
    placeholder: "0-300",
    icon: "water",
    unit: "mg/dL"
  },
  { 
    key: "bloodpressure", 
    label: "Blood Pressure", 
    max: 200, 
    placeholder: "0-200",
    icon: "heart-pulse",
    unit: "mmHg"
  },
  { 
    key: "skinthickness", 
    label: "Skin Thickness", 
    max: 100, 
    placeholder: "0-100",
    icon: "ruler",
    unit: "mm"
  },
  { 
    key: "insulin", 
    label: "Insulin", 
    max: 846, 
    placeholder: "0-846",
    icon: "needle",
    unit: "mu U/ml"
  },
  { 
    key: "bmi", 
    label: "BMI", 
    max: 67.1, 
    placeholder: "0-67.1",
    icon: "scale-bathroom",
    unit: "kg/m²"
  },
  { 
    key: "dpf", 
    label: "Diabetes Pedigree Function", 
    max: 2.42, 
    placeholder: "0-2.42",
    icon: "dna",
    unit: "ratio"
  },
  { 
    key: "age", 
    label: "Age", 
    max: 120, 
    placeholder: "0-120",
    icon: "calendar",
    unit: "years"
  },
];

const BASE_URL = "https://walgar-diabetes.hf.space";
export default function DiabetesPredictScreen() {
  const [fields, setFields] = useState(initialFields);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    checkApiConnection();
  }, []);

  const checkApiConnection = async () => {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      const data = await response.json();
      setApiStatus({
        status: response.ok ? 'connected' : 'error',
        details: data
      });
    } catch (e) {
      setApiStatus({
        status: 'error',
        error: e.message
      });
    }
  };

  const handleChange = (key, value) => {
    if (result) setResult(null);
    if (error) setError(null);
    
    const numericValue = value.replace(/[^0-9.]/g, '');
    setFields({ ...fields, [key]: numericValue });

    // Animate the input
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validateField = (key, value) => {
    const field = fieldLabels.find(f => f.key === key);
    const numValue = parseFloat(value);
    
    if (value === "") return `${field.label} is required`;
    if (isNaN(numValue)) return `${field.label} must be a number`;
    if (numValue < 0) return `${field.label} cannot be negative`;
    if (numValue > field.max) return `${field.label} cannot exceed ${field.max}`;
    
    return null;
  };

  const validate = () => {
    for (let field of fieldLabels) {
      const error = validateField(field.key, fields[field.key]);
      if (error) {
        Alert.alert("Validation Error", error);
        return false;
      }
    }
    return true;
  };

  const handlePredict = async () => {
    if (!validate()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      Object.keys(fields).forEach(key => {
        formData.append(key, fields[key]);
      });

      const response = await fetch(`${BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();

      if (data.success) {
        setResult({
          status: data.prediction_text,
          details: data.prediction === 1 ? 
            "Please consult with a healthcare professional for proper medical advice." :
            "Maintain a healthy lifestyle to stay diabetes-free."
        });
      } else {
        setError(data.error || "An unexpected error occurred");
      }
    } catch (e) {
      setError(`Failed to get prediction: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFields(initialFields);
    setResult(null);
    setError(null);
  };

  const renderInputField = (field) => (
    <View key={field.key} style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        <MaterialCommunityIcons 
          name={field.icon} 
          size={20} 
          color="#666"
          style={styles.fieldIcon}
        />
        <Text style={styles.label}>{field.label}</Text>
        <Text style={styles.unit}>{field.unit}</Text>
      </View>
      <TextInput
        style={[
          styles.input,
          fields[field.key] !== "" && styles.inputFilled
        ]}
        value={fields[field.key]}
        onChangeText={(text) => handleChange(field.key, text)}
        keyboardType="numeric"
        placeholder={field.placeholder}
        placeholderTextColor="#999"
        maxLength={6}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}

          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <MaterialCommunityIcons name="diabetes" size={30} color="#8E24AA" />
            <Text style={styles.title}>Diabetes Risk Assessment</Text>
          </View>

          {apiStatus && (
            <View style={[
              styles.statusContainer,
              apiStatus.status === 'connected' ? styles.statusConnected : styles.statusError
            ]}>
              <MaterialCommunityIcons 
                name={apiStatus.status === 'connected' ? 'check-circle' : 'alert-circle'} 
                size={20} 
                color={apiStatus.status === 'connected' ? '#4CAF50' : '#D63031'} 
              />
              <Text style={styles.statusText}>
                {apiStatus.status === 'connected' ? 'Ready for Analysis' : 'Connection Error'}
              </Text>
            </View>
          )}

          <Text style={styles.subtitle}>
            Enter your health metrics below for accurate assessment
          </Text>

          <View style={styles.formContainer}>
            {fieldLabels.map(renderInputField)}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.predictBtn]}
              onPress={handlePredict}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <MaterialCommunityIcons name="stethoscope" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Analyze Risk</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.resetBtn]}
              onPress={handleReset}
              disabled={loading}
            >
              <MaterialCommunityIcons name="refresh" size={24} color="#666" />
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle" size={24} color="#D63031" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {result && (
            <Animated.View 
              style={[
                styles.resultContainer,
                { opacity: fadeAnim }
              ]}
            >
              <View style={styles.resultHeader}>
                <MaterialCommunityIcons 
                  name={result.status === "Diabetic" ? "alert-circle" : "check-circle"} 
                  size={30} 
                  color={result.status === "Diabetic" ? "#D63031" : "#00B894"}
                />
                <Text style={styles.resultTitle}>Analysis Result</Text>
              </View>
              <Text style={[
                styles.resultText,
                result.status === "Diabetic" ? styles.diabeticText : styles.nonDiabeticText
              ]}>
                {result.status}
              </Text>
              <Text style={styles.resultDetails}>{result.details}</Text>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 20,
    borderRadius: 12,
  },
  statusConnected: {
    backgroundColor: '#E8F5E9',
  },
  statusError: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldIcon: {
    marginRight: 8,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  unit: {
    fontSize: 14,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  inputFilled: {
    backgroundColor: "#fff",
    borderColor: "#8E24AA",
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
  },
  predictBtn: {
    backgroundColor: "#8E24AA",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resetBtn: {
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  resetBtnText: {
    color: "#666",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: "#FFE8E6",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD0CC",
  },
  errorText: {
    flex: 1,
    color: "#D63031",
    fontSize: 16,
    marginLeft: 8,
  },
  resultContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: 'center',
  },
  diabeticText: {
    color: "#D63031",
  },
  nonDiabeticText: {
    color: "#00B894",
  },
  resultDetails: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
});