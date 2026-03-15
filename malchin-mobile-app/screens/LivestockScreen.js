import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert,
} from "react-native";
import API from "../api/api";

const ANIMAL_TYPES = [
  { key: "sheep", label: "Хонь", emoji: "🐑" },
  { key: "goat", label: "Ямаа", emoji: "🐐" },
  { key: "cattle", label: "Үхэр", emoji: "🐄" },
  { key: "horse", label: "Морь", emoji: "🐎" },
  { key: "camel", label: "Тэмээ", emoji: "🐫" },
];

export default function LivestockScreen({ navigation }) {
  const [counts, setCounts] = useState({
    sheep: "320", goat: "210", cattle: "45", horse: "28", camel: "12",
  });

  const updateCount = (key, value) => {
    setCounts((prev) => ({ ...prev, [key]: value }));
  };

  const saveLivestock = async (animalType) => {
    try {
      await API.post("/livestock/add", {
        user_id: 1,
        animal_type: animalType,
        total_count: parseInt(counts[animalType]) || 0,
      });
      Alert.alert("Амжилттай", "Малын тоо хадгалагдлаа");
    } catch {
      Alert.alert("Анхааруулга", "Серверт холбогдож чадсангүй. Offline хадгалагдлаа.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🐑 Малын бүртгэл</Text>
      <Text style={styles.subtitle}>Малынхаа тоог оруулна уу</Text>

      {ANIMAL_TYPES.map((animal) => (
        <View key={animal.key} style={styles.animalRow}>
          <Text style={styles.emoji}>{animal.emoji}</Text>
          <Text style={styles.animalLabel}>{animal.label}</Text>
          <TextInput
            style={styles.input}
            value={counts[animal.key]}
            onChangeText={(v) => updateCount(animal.key, v)}
            keyboardType="numeric"
            placeholder="0"
          />
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => saveLivestock(animal.key)}
          >
            <Text style={styles.saveBtnText}>💾</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Нийт мал</Text>
        <Text style={styles.totalNumber}>
          {Object.values(counts).reduce((sum, v) => sum + (parseInt(v) || 0), 0)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.eventBtn}
        onPress={() => navigation.navigate("LivestockEvent")}
      >
        <Text style={styles.eventBtnText}>📝 Үйл явдал бүртгэх (төл, хорогдол, зарсан...)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f0e8", padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#2d5016", marginTop: 10 },
  subtitle: { fontSize: 14, color: "#777", marginBottom: 20 },
  animalRow: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    padding: 14, borderRadius: 12, marginBottom: 10, elevation: 1,
  },
  emoji: { fontSize: 30, width: 40 },
  animalLabel: { fontSize: 16, fontWeight: "600", flex: 1, color: "#333" },
  input: {
    width: 80, borderWidth: 1, borderColor: "#ddd", borderRadius: 8,
    padding: 8, fontSize: 18, textAlign: "center", fontWeight: "bold",
  },
  saveBtn: { marginLeft: 10, padding: 8 },
  saveBtnText: { fontSize: 22 },
  totalCard: {
    backgroundColor: "#2d5016", padding: 20, borderRadius: 16,
    alignItems: "center", marginTop: 10, marginBottom: 10,
  },
  totalLabel: { fontSize: 14, color: "#c5e1a5" },
  totalNumber: { fontSize: 40, fontWeight: "bold", color: "#fff", marginTop: 4 },
  eventBtn: {
    backgroundColor: "#e8f5e9", padding: 16, borderRadius: 12,
    alignItems: "center", marginBottom: 40,
  },
  eventBtnText: { fontSize: 16, color: "#2d5016", fontWeight: "600" },
});
