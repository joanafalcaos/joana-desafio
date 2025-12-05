import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';

export default function GalleryScreen() {
  const [hasMedia, setHasMedia] = useState(false);

  const handleAddMedia = () => {
    // Implementar funcionalidade de upload
    console.log('Adicionar mídia');
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Galeria</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Seção Suas Mídias */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(100)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Suas Mídias</Text>

          {/* Botão Adicionar Mídia */}
          <TouchableOpacity
            style={styles.addMediaButton}
            onPress={handleAddMedia}
            activeOpacity={0.7}
          >
            <View style={styles.addMediaIconContainer}>
              <MaterialCommunityIcons
                name="plus"
                size={32}
                color="#E87722"
              />
            </View>
            <Text style={styles.addMediaText}>Adicionar Mídia</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Estado Vazio */}
        {!hasMedia && (
          <Animated.View
            entering={FadeIn.duration(600).delay(400)}
            style={styles.emptyStateContainer}
          >
            <View style={styles.emptyStateIconContainer}>
              <MaterialCommunityIcons
                name="folder-open"
                size={64}
                color="#E87722"
              />
            </View>
            <Text style={styles.emptyStateTitle}>Nenhuma mídia</Text>
            <Text style={styles.emptyStateSubtitle}>
              Comece fazendo upload
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* Navegação Inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => router.push('/(tabs)')}
        >
          <MaterialCommunityIcons
            name="home"
            size={28}
            color="#999999"
          />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="history"
            size={28}
            color="#999999"
          />
          <Text style={styles.navText}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="folder-multiple-image"
            size={28}
            color="#E87722"
          />
          <Text style={[styles.navText, styles.navTextActive]}>Galeria</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="account"
            size={28}
            color="#999999"
          />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#E87722',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
  addMediaButton: {
    borderWidth: 2,
    borderColor: '#E87722',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFAF5',
  },
  addMediaIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addMediaText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIconContainer: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  navTextActive: {
    color: '#E87722',
    fontWeight: '600',
  },
});
