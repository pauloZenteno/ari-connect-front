// src/components/MainHeader.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
// 👇 CORRECCIÓN: Agregamos "/images/" a la ruta
import LogoSvg from '../assets/images/logo_ariconnect.svg'; 

export default function MainHeader({ navigation }) {
  return (
    <View style={styles.headerContainer}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          
          <View style={styles.logoContainer}>
            <LogoSvg width={30} height={30} fill="white" /> 
            <Text style={styles.titleText}>Ari Connect</Text>
          </View>

          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() => navigation.navigate('Login')} 
          >
            <Text style={styles.logoutText}>Cerrar sesión</Text>
            <Ionicons name="exit-outline" size={18} color="white" style={{ marginLeft: 5 }} />
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#3B82F6', 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
  },
  safeArea: {
    backgroundColor: '#3B82F6',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)', 
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});