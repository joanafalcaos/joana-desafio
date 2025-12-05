import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { authService } from '../../services/auth';
import { storage } from '../../utils/storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validação
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, informe seu e-mail');
      return;
    }

    if (!password) {
      Alert.alert('Erro', 'Por favor, informe sua senha');
      return;
    }

    try {
      setLoading(true);

      const response = await authService.login({
        email: email.trim().toLowerCase(),
        password,
      });

      // Salvar token e dados do usuário
      await storage.saveAuthToken(response.token);
      await storage.saveUser(response.user);

      // Navegar para home
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Erro no login:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao fazer login. Verifique suas credenciais.';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Container do Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Texto de Boas-Vindas */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Bem-vindo de volta</Text>
          <Text style={styles.titleText}>
            Entre na{'\n'}
            <Text style={styles.titleHighlight}>sua conta</Text>
          </Text>
        </View>

        {/* Container do Formulário */}
        <View style={styles.formContainer}>
          {/* Campo de E-mail */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder=""
            />
          </View>

          {/* Campo de Senha */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Senha</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              placeholder=""
            />
          </View>

          {/* Botão de Login */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Link de Cadastro */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Não tem conta? </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: -30,
  },
  logoCircle: {
    width: 2000,
    height: 200,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  logo: {
    width: 180,
    height: 180,
  },
  welcomeContainer: {
    marginBottom: 48,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 40,
  },
  titleHighlight: {
    color: '#E87722',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontWeight: '400',
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  loginButton: {
    backgroundColor: '#E87722',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#E87722',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
    color: '#666666',
  },
  registerLink: {
    fontSize: 14,
    color: '#E87722',
    fontWeight: '600',
  },
});
