import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { logsService, LogItem } from '../../services/logs';

export default function HistoryScreen() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const logsData = await logsService.getLogs();
      setLogs(logsData);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'upload':
        return 'upload';
      case 'delete':
        return 'delete';
      case 'login':
        return 'login';
      case 'logout':
        return 'logout';
      default:
        return 'information';
    }
  };

  const getActionText = (action: string) => {
    switch (action.toLowerCase()) {
      case 'upload':
        return 'Upload realizado com sucesso';
      case 'delete':
        return 'Arquivo deletado';
      case 'login':
        return 'Login realizado com sucesso';
      case 'logout':
        return 'Logout realizado';
      default:
        return action;
    }
  };

  // Agrupar logs por data
  const groupLogsByDate = (logs: LogItem[]) => {
    const grouped: { [key: string]: LogItem[] } = {};

    logs.forEach((log) => {
      const date = formatDate(log.createdAt);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(log);
    });

    return grouped;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E87722" />
      </View>
    );
  }

  const groupedLogs = groupLogsByDate(logs);
  const dates = Object.keys(groupedLogs);

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Título da Seção */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(100)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Suas atividades</Text>
        </Animated.View>

        {/* Lista de Logs Agrupados por Data */}
        {dates.length > 0 ? (
          dates.map((date, dateIndex) => (
            <Animated.View
              key={date}
              entering={FadeInUp.duration(400).delay(dateIndex * 100 + 200)}
              style={styles.dateGroup}
            >
              <Text style={styles.dateHeader}>{date}</Text>

              {groupedLogs[date].map((log, logIndex) => (
                <Animated.View
                  key={log._id}
                  entering={FadeIn.duration(300).delay(logIndex * 50)}
                  style={styles.logCard}
                >
                  <View style={styles.logIconContainer}>
                    <MaterialCommunityIcons
                      name={getActionIcon(log.action)}
                      size={24}
                      color="#E87722"
                    />
                  </View>
                  <View style={styles.logContent}>
                    <Text style={styles.logAction}>{getActionText(log.action)}</Text>
                    <Text style={styles.logTime}>{formatTime(log.createdAt)}</Text>
                  </View>
                </Animated.View>
              ))}
            </Animated.View>
          ))
        ) : (
          <Animated.View
            entering={FadeIn.duration(600).delay(400)}
            style={styles.emptyStateContainer}
          >
            <View style={styles.emptyStateIconContainer}>
              <MaterialCommunityIcons
                name="history"
                size={64}
                color="#E87722"
              />
            </View>
            <Text style={styles.emptyStateTitle}>Nenhuma atividade</Text>
            <Text style={styles.emptyStateSubtitle}>
              Suas atividades aparecerão aqui
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
            color="#E87722"
          />
          <Text style={[styles.navText, styles.navTextActive]}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => router.push('/(tabs)/gallery')}
        >
          <MaterialCommunityIcons
            name="folder-multiple-image"
            size={28}
            color="#999999"
          />
          <Text style={styles.navText}>Galeria</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  dateGroup: {
    marginBottom: 32,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 16,
  },
  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logContent: {
    flex: 1,
  },
  logAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  logTime: {
    fontSize: 12,
    color: '#666666',
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
