import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Checkbox from 'expo-checkbox';

import LogoSvg from '../assets/images/logo_ariconnect.svg';
import BgSvg from '../assets/images/bg_loginariconnect.svg';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setChecked] = useState(false);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.svgBackgroundContainer}>
        <BgSvg width={width} height={height} preserveAspectRatio="xMidYMid slice" />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          
          <View style={styles.headerContainer}>
            <LogoSvg width={120} height={120} />
            <Text style={styles.appTitle}>Ari Connect</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#A0A0A0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#A0A0A0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={styles.optionsRow}>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  style={styles.checkbox}
                  value={isChecked}
                  onValueChange={setChecked}
                  color={isChecked ? '#4FD1C5' : undefined} 
                />
                <Text style={styles.optionText}>Recordarme</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.optionText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.buttonContainer} 
              activeOpacity={0.8}
              onPress={() => navigation.replace('Home')}
            >
              <LinearGradient
                colors={['#4FD1C5', '#38B2AC', '#319795']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
            <TouchableOpacity>
              <Text style={[styles.footerText, styles.linkText]}>Contáctanos</Text>
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  svgBackgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  formContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 25, 
    paddingVertical: 15,
    paddingHorizontal: 25,
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 10,
    borderRadius: 5,
    borderColor: 'white',
  },
  optionText: {
    color: 'white',
    fontSize: 14,
  },
  buttonContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  gradientButton: {
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute', 
    bottom: 30,
    left: 0,
    right: 0,
  },
  footerText: {
    color: 'white',
    fontSize: 16,
  },
  linkText: {
    color: '#4FD1C5', 
    fontWeight: 'bold',
  },
});