import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🐑 МАЛЧИН</Text>
        <Text style={styles.subtitle}>Малчны супер апп</Text>
      </View>

      <View style={styles.weatherCard}>
        <Text style={styles.weatherTitle}>🌤 Өнөөдрийн цаг агаар</Text>
        <Text style={styles.weatherTemp}>-5°C</Text>
        <Text style={styles.weatherDesc}>Цэлмэг, салхи 3м/с</Text>
        <Text style={styles.weatherAlert}>✅ Зудын эрсдэл: Бага</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🐑</Text>
          <Text style={styles.statNumber}>320</Text>
          <Text style={styles.statLabel}>Хонь</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🐐</Text>
          <Text style={styles.statNumber}>210</Text>
          <Text style={styles.statLabel}>Ямаа</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🐄</Text>
          <Text style={styles.statNumber}>45</Text>
          <Text style={styles.statLabel}>Үхэр</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🐎</Text>
          <Text style={styles.statNumber}>28</Text>
          <Text style={styles.statLabel}>Морь</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Түргэн үйлдэл</Text>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>➕ Төл бүртгэх</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>🛒 Мал зарах зар нэмэх</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>💰 Орлого/зардал бүртгэх</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>⚠️ Аюулын мэдэгдэл илгээх</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.aiCard}>
        <Text style={styles.aiTitle}>🧠 AI зөвлөгөө</Text>
        <Text style={styles.aiText}>
          Энэ 7 хоногт хүйтрэлт ихсэнэ. Малаа хашааны ойролцоо байлгаж,
          тэжээлийн нөөцөө шалгаарай.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f0e8" },
  header: { padding: 20, paddingTop: 50, alignItems: "center", backgroundColor: "#2d5016" },
  logo: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, color: "#c5e1a5", marginTop: 4 },
  weatherCard: {
    margin: 16, padding: 20, backgroundColor: "#e8f5e9", borderRadius: 16,
  },
  weatherTitle: { fontSize: 16, fontWeight: "600", color: "#2d5016" },
  weatherTemp: { fontSize: 40, fontWeight: "bold", color: "#1b5e20", marginTop: 8 },
  weatherDesc: { fontSize: 14, color: "#555", marginTop: 4 },
  weatherAlert: { fontSize: 14, color: "#388e3c", marginTop: 8, fontWeight: "600" },
  statsRow: {
    flexDirection: "row", justifyContent: "space-around", marginHorizontal: 8, marginBottom: 16,
  },
  statCard: {
    alignItems: "center", backgroundColor: "#fff", padding: 12, borderRadius: 12,
    width: 80, elevation: 2,
  },
  statEmoji: { fontSize: 28 },
  statNumber: { fontSize: 20, fontWeight: "bold", color: "#333", marginTop: 4 },
  statLabel: { fontSize: 12, color: "#777", marginTop: 2 },
  quickActions: { margin: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 12 },
  actionBtn: {
    backgroundColor: "#fff", padding: 16, borderRadius: 12, marginBottom: 8, elevation: 1,
  },
  actionText: { fontSize: 16, color: "#2d5016", fontWeight: "500" },
  aiCard: {
    margin: 16, padding: 20, backgroundColor: "#fff3e0", borderRadius: 16, marginBottom: 40,
  },
  aiTitle: { fontSize: 16, fontWeight: "bold", color: "#e65100" },
  aiText: { fontSize: 14, color: "#555", marginTop: 8, lineHeight: 22 },
});
