// src/components/MainHeader.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Iconos incluidos en Expo
import LogoSvg from '../assets/logo_ariconnect.svg'; // Reusamos tu logo

export default function MainHeader({ navigation }) {
  return (
    <View style={styles.headerContainer}>
      {/* Ajuste para la barra de estado (Notch) */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          
          {/* Lado Izquierdo: Logo y Nombre */}
          <View style={styles.logoContainer}>
            {/* Escalamos el logo pequeño */}
            <LogoSvg width={30} height={30} fill="white" /> 
            <Text style={styles.titleText}>Ari Connect</Text>
          </View>

          {/* Lado Derecho: Botón Cerrar Sesión */}
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() => navigation.navigate('Login')} // Simulamos logout
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
    backgroundColor: '#3B82F6', // Un azul similar al de tu captura
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    borderBottomLeftRadius: 0, // Recto como en la imagen
    borderBottomRightRadius: 0,
    // Sombra suave
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
    backgroundColor: 'rgba(255,255,255,0.2)', // Fondo semitransparente
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