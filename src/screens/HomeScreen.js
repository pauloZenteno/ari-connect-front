import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, 
  StatusBar, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ConnectionModal from '../components/ConnectionModal';
import { checkConnection } from '../services/dahua/deviceService';

const DEVICES = [
  { id: '1', brand: 'Dahua', model: '3CODE', serial: 'wja6234400022' }
];

export default function HomeScreen({ navigation }) {
  const [expandedId, setExpandedId] = useState('1'); 
  const [deviceIp, setDeviceIp] = useState('');
  const [devicePass, setDevicePass] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberIp, setRememberIp] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('idle');

  const handleConnect = async () => {
    if (!deviceIp || !devicePass) {
      Alert.alert("Campos Requeridos", "Ingresa IP y Contraseña.");
      return;
    }

    setConnectionStatus('connecting');
    setModalVisible(true);

    try {
      const result = await checkConnection(deviceIp, devicePass);

      if (result.success) {
        setConnectionStatus('success');
        setTimeout(() => {
            setModalVisible(false);
            navigation.navigate('RegisterUser', { 
                targetIp: deviceIp,
                targetPass: devicePass
            });
        }, 2000); 
      } else {
        console.log("Error Conexión:", result.error);
        handleError();
      }
    } catch (error) {
      console.log("Error Catch:", error);
      handleError();
    }
  };

  const handleError = () => {
    setConnectionStatus('error');
    setTimeout(() => {
        setModalVisible(false);
    }, 2500);
  };

  const renderItem = ({ item }) => {
    const isExpanded = item.id === expandedId;

    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity 
          activeOpacity={0.8} 
          style={[styles.card, isExpanded && styles.cardExpanded]} 
          onPress={() => setExpandedId(isExpanded ? null : item.id)}
        >
          <View style={styles.cardHeader}>
            <View style={styles.infoContainer}>
                <View style={styles.titleRow}>
                    <Text style={styles.brandText}>{item.brand}</Text>
                    <Text style={styles.modelText}>{item.model}</Text>
                </View>
                <Text style={styles.serialText}>{item.serial}</Text>
            </View>
            <Ionicons name="create-outline" size={20} color="#60A5FA" />
          </View>

          {isExpanded && (
            <View style={styles.expandedContent}>
              <View style={styles.divider} />
              
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.textInput}
                  placeholder="IP: 192.168.1.108"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={deviceIp}
                  onChangeText={setDeviceIp}
                />
              </View>

              <View style={[styles.inputWrapper, styles.passwordWrapper, { marginTop: 10 }]}>
                <TextInput 
                  style={[styles.textInput, { flex: 1 }]}
                  placeholder="Contraseña"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!isPasswordVisible} 
                  value={devicePass}
                  onChangeText={setDevicePass}
                />
                <TouchableOpacity 
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={{ padding: 10 }}
                >
                    <Ionicons 
                        name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                        size={22} 
                        color="#9CA3AF" 
                    />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.checkboxRow} 
                onPress={() => setRememberIp(!rememberIp)}
              >
                <Ionicons 
                    name={rememberIp ? "checkbox" : "square-outline"} 
                    size={22} 
                    color={rememberIp ? "#34D399" : "#9CA3AF"} 
                />
                <Text style={styles.checkboxLabel}>Recordar IP</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.connectButton}
                onPress={handleConnect}
              >
                  <Text style={styles.connectButtonText}>Conectar</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ConnectionModal visible={modalVisible} status={connectionStatus} />

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Dispositivos biométricos</Text>

        <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#9CA3AF" style={{marginRight: 10}} />
            <TextInput 
                style={styles.searchInput}
                placeholder="Buscar"
                placeholderTextColor="#9CA3AF"
                value={searchText}
                onChangeText={setSearchText}
            />
            <Ionicons name="mic-outline" size={20} color="#9CA3AF" />
        </View>

        <FlatList
            data={DEVICES}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  body: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginTop: 20, marginBottom: 15, textAlign: 'center' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2
  },
  searchInput: { flex: 1, fontSize: 16, color: '#374151' },
  listContent: { paddingBottom: 30 },
  cardContainer: { marginBottom: 15 },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3,
    borderWidth: 1, borderColor: 'transparent'
  },
  cardExpanded: { borderColor: '#E5E7EB' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  infoContainer: { flexDirection: 'column', flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  brandText: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginRight: 8 },
  modelText: { fontSize: 14, fontWeight: '400', color: '#4B5563' },
  serialText: { fontSize: 12, color: '#9CA3AF' },
  expandedContent: { marginTop: 15 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginBottom: 15 },
  inputWrapper: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 5,
  },
  textInput: {
    padding: 12,
    fontSize: 16,
    color: '#374151',
    width: '100%',
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 5 },
  checkboxLabel: { color: '#6B7280', marginLeft: 8, fontSize: 14 },
  connectButton: {
    backgroundColor: '#D1FAE5', 
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  connectButtonText: {
    color: '#065F46', 
    fontWeight: '600',
    fontSize: 16
  }
});