import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HealthScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const healthMetrics = [
    {
      title: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      status: 'normal',
      icon: 'heart-pulse',
      color: '#FF6B6B',
      change: '-5%',
    },
    {
      title: 'Blood Sugar',
      value: '95',
      unit: 'mg/dL',
      status: 'normal',
      icon: 'diabetes',
      color: '#4CAF50',
      change: '+2%',
    },
    {
      title: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      status: 'normal',
      icon: 'heart',
      color: '#FF9800',
      change: 'stable',
    },
    {
      title: 'Sleep',
      value: '7.5',
      unit: 'hours',
      status: 'good',
      icon: 'sleep',
      color: '#2196F3',
      change: '+30min',
    },
  ];

  const activities = [
    {
      title: 'Walking',
      value: '8,234',
      unit: 'steps',
      icon: 'walk',
      color: '#4CAF50',
    },
    {
      title: 'Water',
      value: '6/8',
      unit: 'glasses',
      icon: 'water',
      color: '#2196F3',
    },
    {
      title: 'Exercise',
      value: '45',
      unit: 'minutes',
      icon: 'dumbbell',
      color: '#FF9800',
    },
  ];

  const renderMetricCard = (metric, index) => (
    <TouchableOpacity 
      key={index}
      style={styles.metricCard}
      activeOpacity={0.9}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${metric.color}15` }]}>
        <MaterialCommunityIcons name={metric.icon} size={24} color={metric.color} />
      </View>
      <Text style={styles.metricTitle}>{metric.title}</Text>
      <View style={styles.metricValueContainer}>
        <Text style={styles.metricValue}>{metric.value}</Text>
        <Text style={styles.metricUnit}>{metric.unit}</Text>
      </View>
      <View style={[styles.statusContainer, { backgroundColor: `${metric.color}15` }]}>
        <Text style={[styles.statusText, { color: metric.color }]}>{metric.change}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderActivityCard = (activity, index) => (
    <View key={index} style={styles.activityCard}>
      <MaterialCommunityIcons name={activity.icon} size={24} color={activity.color} />
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityValue}>
          {activity.value} <Text style={styles.activityUnit}>{activity.unit}</Text>
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Health Overview</Text>
            <Text style={styles.subtitle}>Track your daily wellness</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <MaterialCommunityIcons name="account" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.periodSelector}>
          {['day', 'week', 'month'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.metricsGrid}>
          {healthMetrics.map(renderMetricCard)}
        </View>

        <Text style={styles.sectionTitle}>Today's Activities</Text>
        <View style={styles.activitiesContainer}>
          {activities.map(renderActivityCard)}
        </View>

        <TouchableOpacity style={styles.addButton}>
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Measurement</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  profileButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  periodButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#333',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  metricUnit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  statusContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  activitiesContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  activityInfo: {
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  activityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activityUnit: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFB300',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});