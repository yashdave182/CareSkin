// screens/CKDPredictScreen.js
import React, { useState } from 'react';
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
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';

const API_URL = 'https://walgar-ckd.hf.space';

const YES_NO_OPTIONS = [
  { label: 'No', value: 0 },
  { label: 'Yes', value: 1 },
];

export default function CKDPredictScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const [formData, setFormData] = useState({
    age: '', blood_pressure: '', specific_gravity: '', albumin: '', sugar: '',
    red_blood_cells: 0, pus_cell: 0, pus_cell_clumps: 0, bacteria: 0,
    blood_glucose_random: '', blood_urea: '', serum_creatinine: '',
    sodium: '', potassium: '', haemoglobin: '', packed_cell_volume: '',
    white_blood_cell_count: '', red_blood_cell_count: '', hypertension: 0,
    diabetes_mellitus: 0, coronary_artery_disease: 0, appetite: 0,
    peda_edema: 0, aanemia: 0,
  });

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    const requestData = {
      age: parseFloat(formData.age) || 0,
      blood_pressure: parseFloat(formData.blood_pressure) || 0,
      specific_gravity: parseFloat(formData.specific_gravity) || 0,
      albumin: parseFloat(formData.albumin) || 0,
      sugar: parseFloat(formData.sugar) || 0,
      red_blood_cells: parseInt(formData.red_blood_cells) || 0,
      pus_cell: parseInt(formData.pus_cell) || 0,
      pus_cell_clumps: parseInt(formData.pus_cell_clumps) || 0,
      bacteria: parseInt(formData.bacteria) || 0,
      blood_glucose_random: parseFloat(formData.blood_glucose_random) || 0,
      blood_urea: parseFloat(formData.blood_urea) || 0,
      serum_creatinine: parseFloat(formData.serum_creatinine) || 0,
      sodium: parseFloat(formData.sodium) || 0,
      potassium: parseFloat(formData.potassium) || 0,
      haemoglobin: parseFloat(formData.haemoglobin) || 0,
      packed_cell_volume: parseFloat(formData.packed_cell_volume) || 0,
      white_blood_cell_count: parseFloat(formData.white_blood_cell_count) || 0,
      red_blood_cell_count: parseFloat(formData.red_blood_cell_count) || 0,
      hypertension: parseInt(formData.hypertension) || 0,
      diabetes_mellitus: parseInt(formData.diabetes_mellitus) || 0,
      coronary_artery_disease: parseInt(formData.coronary_artery_disease) || 0,
      appetite: parseInt(formData.appetite) || 0,
      peda_edema: parseInt(formData.peda_edema) || 0,
      aanemia: parseInt(formData.aanemia) || 0,
    };

    console.log('Sending request with:', requestData);

    try {
      const response = await axios.post(`${API_URL}/predict`, requestData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Response:', response.data);
      setPrediction(response.data);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Prediction failed. Please verify inputs.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, field) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={formData[field]}
        onChangeText={(val) => setFormData({ ...formData, [field]: val })}
        keyboardType="numeric"
        placeholder={`Enter ${label}`}
      />
    </View>
  );

  const renderPicker = (label, field) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData[field]}
          onValueChange={(val) => setFormData({ ...formData, [field]: val })}
        >
          {YES_NO_OPTIONS.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.header}>
        <MaterialIcons name="healing" size={28} color="#2196F3" />
        <Text style={styles.headerTitle}>CKD Prediction</Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        {renderInput('Age', 'age')}
        {renderInput('Blood Pressure', 'blood_pressure')}
        {renderInput('Specific Gravity', 'specific_gravity')}
        {renderInput('Albumin', 'albumin')}
        {renderInput('Sugar', 'sugar')}
        {renderPicker('Red Blood Cells', 'red_blood_cells')}
        {renderPicker('Pus Cell', 'pus_cell')}
        {renderPicker('Pus Cell Clumps', 'pus_cell_clumps')}
        {renderPicker('Bacteria', 'bacteria')}
        {renderInput('Blood Glucose Random', 'blood_glucose_random')}
        {renderInput('Blood Urea', 'blood_urea')}
        {renderInput('Serum Creatinine', 'serum_creatinine')}
        {renderInput('Sodium', 'sodium')}
        {renderInput('Potassium', 'potassium')}
        {renderInput('Haemoglobin', 'haemoglobin')}
        {renderInput('Packed Cell Volume', 'packed_cell_volume')}
        {renderInput('WBC Count', 'white_blood_cell_count')}
        {renderInput('RBC Count', 'red_blood_cell_count')}
        {renderPicker('Hypertension', 'hypertension')}
        {renderPicker('Diabetes Mellitus', 'diabetes_mellitus')}
        {renderPicker('Coronary Artery Disease', 'coronary_artery_disease')}
        {renderPicker('Appetite', 'appetite')}
        {renderPicker('Pedal Edema', 'peda_edema')}
        {renderPicker('Anemia', 'aanemia')}

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={handlePredict} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Analyze</Text>}
        </TouchableOpacity>

        {prediction && (
          <View
            style={[styles.resultBox, {
              backgroundColor: prediction.prediction === 'ckd' ? '#E5F6FF' : '#FFE5E5',
            }]}
          >
            <Text
              style={[styles.resultText, {
                color: prediction.prediction === 'ckd' ? '#4CAF50' : '#FF6B6B',
              }]}
            >
              {prediction.prediction === 'ckd' ? 'No CKD Detected' : 'CKD Detected'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 12 },
  form: { padding: 16, paddingBottom: 120 },
  fieldContainer: { marginBottom: 16 },
  label: { fontSize: 15, marginBottom: 6, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  button: { backgroundColor: '#2196F3', padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  error: { color: 'red', textAlign: 'center', marginVertical: 8 },
  resultBox: { marginTop: 20, padding: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  resultText: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
});
