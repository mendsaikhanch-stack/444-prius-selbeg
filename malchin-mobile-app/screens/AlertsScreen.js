import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert,
} from "react-native";
import API from "../api/api";

const ALERT_TYPES = [
  { key: "wolf", label: "Чоно үзэгдсэн", emoji: "🐺" },
  { key: "dzud", label: "Зудын эрсдэл", emoji: "❄️" },
  { key: "theft", label: "Хулгай", emoji: "🚨" },
  { key: "storm", label: "Шуурга", emoji: "🌪️" },
  { key: "disease", label: "Малын өвчин", emoji: "🦠" },
  { key: "road_closed", label: "Зам хаагдсан", emoji: "🚧" },
];

const SEVERITY_LEVELS = [
  { key: "green", label: "Бага", color: "#4caf50" },
  { key: "yellow", label: "Дунд", color: "#ff9800" },
  { key: "orange", label: "Өндөр", color: "#f44336" },
  { key: "red", label: "Аюултай", color: "#b71c1c" },
];

const SAMPLE_ALERTS = [
  {
    id: 1, type: "wolf", title: "Чоно үзэгдсэн", severity: "orange",
    region: "Архангай, Батцэнгэл", description: "Өчигдөр оройн 8 цагт 3 чоно үзэгдсэн",
    created_at: "2026-03-14",
  },
  {
    id: 2, type: "dzud", title: "Цас их ороно", severity: "yellow",
    region: "Хөвсгөл", description: "3 хоногийн дотор 20см цас орохоор байна",
    created_at: "2026-03-13",
  },
  {
    id: 3, type: "disease", title: "Шүлхий өвчин анхааруулга", severity: "red",
    region: "Дорнод", description: "Хэрлэн суманд шүлхий өвчин илэрсэн",
    created_at: "2026-03-12",
  },
];

export default function AlertsScreen() {
  const [alerts] = useState(SAMPLE_ALERTS);
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState("wolf");
  const [severity, setSeverity] = useState("yellow");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");

  const getAlertEmoji = (type) => {
    const found = ALERT_TYPES.find((a) => a.key === type);
    return found ? found.emoji : "⚠️";
  };

  const getSeverityColor = (sev) => {
    const found = SEVERITY_LEVELS.find((s) => s.key === sev);
    return found ? found.color : "#ff9800";
  };

  const submitAlert = async () => {
    if (!title || !region) {
      Alert.alert("Алдаа", "Гарчиг, бүс нутаг оруулна уу");
      return;
    }
    try {
      await API.post("/alerts/create", {
        user_id: 1,
        region,
        type: selectedType,
        title,
        description,
        severity,
      });
      Alert.alert("Амжилттай", "Аюулын мэдэгдэл илгээгдлээ");
      setShowForm(false);
      setTitle("");
      setDescription("");
      setRegion("");
    } catch {
      Alert.alert("Анхааруулга", "Offline хадгалагдлаа");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>⚠️ Аюулын мэдэгдэл</Text>
        <TouchableOpacity
          style={styles.toggleBtn}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.toggleText}>{showForm ? "✕ Хаах" : "+ Мэдэгдэл"}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.formCard}>
          <Text style={styles.label}>Төрөл</Text>
          <View style={styles.chipRow}>
            {ALERT_TYPES.map((a) => (
              <TouchableOpacity
                key={a.key}
                style={[styles.chip, selectedType === a.key && styles.chipActive]}
                onPress={() => setSelectedType(a.key)}
              >
                <Text style={styles.chipEmoji}>{a.emoji}</Text>
                <Text style={[styles.chipText, selectedType === a.key && styles.chipTextActive]}>
                  {a.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Түвшин</Text>
          <View style={styles.sevRow}>
            {SEVERITY_LEVELS.map((s) => (
              <TouchableOpacity
                key={s.key}
                style={[styles.sevBtn, { borderColor: s.color }, severity === s.key && { backgroundColor: s.color }]}
                onPress={() => setSeverity(s.key)}
              >
                <Text style={[styles.sevText, severity === s.key && { color: "#fff" }]}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Гарчиг" />
          <TextInput style={styles.input} value={region} onChangeText={setRegion} placeholder="Бүс нутаг" />
          <TextInput
            style={[styles.input, { height: 70 }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Дэлгэрэнгүй..."
            multiline
          />

          <TouchableOpacity style={styles.submitBtn} onPress={submitAlert}>
            <Text style={styles.submitText}>🚨 Мэдэгдэл илгээх</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.sectionTitle}>Сүүлийн мэдэгдлүүд</Text>
      {alerts.map((alert) => (
        <View key={alert.id} style={[styles.alertCard, { borderLeftColor: getSeverityColor(alert.severity) }]}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertEmoji}>{getAlertEmoji(alert.type)}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertRegion}>📍 {alert.region}</Text>
            </View>
            <View style={[styles.sevBadge, { backgroundColor: getSeverityColor(alert.severity) }]}>
              <Text style={styles.sevBadgeText}>
                {SEVERITY_LEVELS.find((s) => s.key === alert.severity)?.label}
              </Text>
            </View>
          </View>
          <Text style={styles.alertDesc}>{alert.description}</Text>
          <Text style={styles.alertDate}>{alert.created_at}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f0e8", padding: 16, paddingTop: 50 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#c62828" },
  toggleBtn: { backgroundColor: "#c62828", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  toggleText: { color: "#fff", fontWeight: "bold" },
  formCard: { backgroundColor: "#fff", padding: 16, borderRadius: 14, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "600", color: "#555", marginTop: 10, marginBottom: 6 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 16, backgroundColor: "#f5f5f5", borderWidth: 1, borderColor: "#ddd",
  },
  chipActive: { backgroundColor: "#c62828", borderColor: "#c62828" },
  chipEmoji: { fontSize: 16, marginRight: 4 },
  chipText: { fontSize: 12, color: "#333" },
  chipTextActive: { color: "#fff" },
  sevRow: { flexDirection: "row", gap: 8 },
  sevBtn: { flex: 1, padding: 8, borderRadius: 8, borderWidth: 2, alignItems: "center" },
  sevText: { fontSize: 12, fontWeight: "bold", color: "#333" },
  input: {
    backgroundColor: "#f9f9f9", borderWidth: 1, borderColor: "#ddd", borderRadius: 8,
    padding: 12, fontSize: 15, marginTop: 8,
  },
  submitBtn: { backgroundColor: "#c62828", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 14 },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 10 },
  alertCard: {
    backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 10,
    borderLeftWidth: 5, elevation: 1,
  },
  alertHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  alertEmoji: { fontSize: 28, marginRight: 10 },
  alertTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  alertRegion: { fontSize: 12, color: "#888", marginTop: 2 },
  sevBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  sevBadgeText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  alertDesc: { fontSize: 14, color: "#555", lineHeight: 20 },
  alertDate: { fontSize: 11, color: "#aaa", marginTop: 6, textAlign: "right" },
});
