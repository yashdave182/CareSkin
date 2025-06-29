import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const cards = [
  {
    title: 'Predict Disease',
    image: require('../assets/predict_disease.jpg'),
    button: 'Begin',
    nav: 'Scanner',
    icon: 'medical'
  },
  {
    title: 'Consult a Doctor',
    image: require('../assets/consult_doctor.jpg'),
    button: 'Find Doctor',
    nav: '',
    icon: 'people'
  },
  {
    title: 'View Health Reports',
    image: require('../assets/health_reports.jpg'),
    button: 'View',
    nav: '',
    icon: 'document-text'
  },
  {
    title: 'Learn About Conditions',
    image: require('../assets/learn_conditions.jpg'),
    button: 'Explore',
    nav: '',
    icon: 'book'
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const scrollY = new Animated.Value(0);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const CardComponent = ({ card, index }) => {
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

      if (card.nav) {
        navigation.navigate(card.nav);
      }
    };

    return (
      <Animated.View style={[styles.cardContainer, { transform: [{ scale }] }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={animatePress}
          disabled={!card.nav}
          style={styles.cardTouchable}
        >
          <Image source={card.image} style={styles.cardImage} />
          <View style={styles.overlay} />
          <View style={styles.cardContent}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name={card.icon} size={24} color="#fff" />
              <Text style={styles.cardTitle}>{card.title}</Text>
            </View>
            <View style={[styles.cardButton, !card.nav && styles.cardButtonDisabled]}>
              <Text style={styles.cardButtonText}>{card.button}</Text>
              {card.nav && <Ionicons name="arrow-forward" size={16} color="#fff" style={styles.buttonIcon} />}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerRow}>
          <View style={styles.welcomeContainer}>
            <View style={styles.welcomeTextRow}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <MaterialCommunityIcons name="home-heart" size={24} color="#0092FF" />
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.headerName}>Rohan</Text>
            </View>
          </View>
          
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#A1AEB7" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchBox} 
            placeholder="Search Symptoms" 
            placeholderTextColor="#A1AEB7"
          />
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.cardsContainer}>
          {cards.map((card, i) => (
            <CardComponent key={i} card={card} index={i} />
          ))}
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
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  welcomeContainer: {
    flex: 1,
    marginRight: 16,
  },
  welcomeTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 0.5,
  },
  heartIconContainer: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heartIcon: {
    width: 24,
    height: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBox: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  cardsContainer: {
    padding: 16,
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#fff',
  },
  cardTouchable: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
  },
  cardContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    flex: 1,
  },
  cardButton: {
    backgroundColor: '#0092FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
    justifyContent: 'center',
  },
  cardButtonDisabled: {
    backgroundColor: 'rgba(161, 174, 183, 0.8)',
  },
  cardButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});