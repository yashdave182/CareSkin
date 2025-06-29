import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const diseases = [
  { 
    name: 'Skin Disease', 
    image: require('../assets/skin_disease.jpg'), 
    nav: 'DiseasePredict',
    icon: 'bandage',
    description: 'Analyze skin conditions'
  },
  { 
    name: 'Pneumonia', 
    image: require('../assets/pneumonia.jpg'), 
    nav: 'pneumonia',
    icon: 'lungs',
    description: 'Check for pneumonia signs'
  },
  { 
    name: 'Lung Cancer', 
    image: require('../assets/lung_cancer.jpg'), 
    nav: 'LungCancer',
    icon: 'lungs',
    description: 'Early detection scan'
  },
  { 
    name: 'Diabetes', 
    image: require('../assets/diabetes.jpg'), 
    nav: 'DiabetesPredict',
    icon: 'diabetes',
    description: 'Diabetes risk assessment'
  },
  { 
    name: 'Hypertension', 
    image: require('../assets/hypertension.jpg'), 
    nav: 'HypertensionPredict',
    icon: 'heart-pulse',
    description: 'Blood pressure analysis'
  },
  { 
    name: 'Chronic Kidney Disease', 
    image: require('../assets/kidney_disease.jpg'), 
    nav: 'CKDPredict',
    icon: 'kidney',
    description: 'Kidney health check'
  },
];

export default function ScannerScreen() {
  const navigation = useNavigation();

  const renderCard = (disease, index) => {
    const scale = new Animated.Value(1);

    const animatePress = () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      if (disease.nav) {
        navigation.navigate(disease.nav);
      }
    };

    return (
      <Animated.View 
        key={index}
        style={[styles.cardContainer, { transform: [{ scale }] }]}
      >
        <TouchableOpacity
          style={[styles.card, !disease.nav && styles.cardDisabled]}
          onPress={animatePress}
          activeOpacity={0.9}
          disabled={!disease.nav}
        >
          <Image source={disease.image} style={styles.img} />
          <View style={styles.overlay} />
          <View style={styles.cardContent}>
            <MaterialCommunityIcons 
              name={disease.icon} 
              size={24} 
              color="#0092FF" 
              style={styles.cardIcon}
            />
            <Text style={styles.label}>{disease.name}</Text>
            <Text style={styles.description}>{disease.description}</Text>
            {disease.nav ? (
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Available</Text>
              </View>
            ) : (
              <View style={[styles.statusContainer, styles.statusContainerDisabled]}>
                <Text style={styles.statusTextDisabled}>Coming Soon</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="scan-helper" size={28} color="#0092FF" />
          <Text style={styles.title}>AI Health Scanner</Text>
        </View>
        <Text style={styles.subtitle}>Select a condition to analyze</Text>
      </View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {diseases.map((disease, index) => renderCard(disease, index))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginLeft: 38,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardDisabled: {
    opacity: 0.8,
  },
  img: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 16,
  },
  cardContent: {
    padding: 12,
    backgroundColor: '#fff',
  },
  cardIcon: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C853',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#00C853',
    fontWeight: '500',
  },
  statusContainerDisabled: {
    opacity: 0.6,
  },
  statusTextDisabled: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});