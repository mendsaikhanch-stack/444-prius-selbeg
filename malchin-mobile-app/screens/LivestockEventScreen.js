import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert,
} from "react-native";
import API from "../api/api";

const EVENT_TYPES = [
  { key: "birth", label: "Төл гарсан", emoji: "🐣" },
  { key: "death", label: "Хорогдол", emoji: "💀" },
  { key: "sold", label: "Зарсан", emoji: "💸" },
  { key: "purchased", label: "Худалдаж авсан", emoji: "🛒" },
  { key: "vaccinated", label: "Вакцин хийсэн", emoji: "💉" },
];

const ANIMALS = [
  { key: "sheep", label: "Хонь" },
  { key: "goat", label: "Ямаа" },
  { key: "cattle", label: "Үхэр" },
  { key: "horse", label: "Морь" },
  { key: "camel", label: "Тэмээ" },
];

export default function LivestockEventScreen() {
  const [selectedEvent, setSelectedEvent] = useState("birth");
  const [selectedAnimal, setSelectedAnimal] = useState("sheep");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

  const saveEvent = async () => {
    if (!quantity) {
      Alert.alert("Алдаа", "Тоо оруулна уу");
      return;
    }
    try {
      await API.post("/livestock/event", {
        user_id: 1,
        animal_type: selectedAnimal,
        event_type: selectedEvent,
        quantity: parseInt(quantity),
        note,
      });
      Alert.alert("Амжилттай", "Үйл явдал бүртгэгдлээ");
      setQuantity("");
      setNote("");
    } catch {
      Alert.alert("Анхааруулга", "Offline хадгалагдлаа");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Үйл явдал бүртгэх</Text>

      <Text style={styles.label}>Малын төрөл</Text>
      <View style={styles.chipRow}>
        {ANIMALS.map((a) => (
          <TouchableOpacity
            key={a.key}
            style={[styles.chip, selectedAnimal === a.key && styles.chipActive]}
            onPress={() => setSelectedAnimal(a.key)}
          >
            <Text style={[styles.chipText, selectedAnimal === a.key && styles.chipTextActive]}>
              {a.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Үйл явдлын төрөл</Text>
      {EVENT_TYPES.map((e) => (
        <TouchableOpacity
          key={e.key}
          style={[styles.eventRow, selectedEvent === e.key && styles.eventRowActive]}
          onPress={() => setSelectedEvent(e.key)}
        >
          <Text style={styles.eventEmoji}>{e.emoji}</Text>
          <Text style={[styles.eventLabel, selectedEvent === e.key && styles.eventLabelActive]}>
            {e.label}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Тоо</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        placeholder="Жишээ: 15"
      />

      <Text style={styles.label}>Тэмдэглэл</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={note}
        onChangeText={setNote}
        placeholder="Нэмэлт мэдээлэл..."
        multiline
      />

      <TouchableOpacity style={styles.submitBtn} onPress={saveEvent}>
        <Text style={styles.submitText}>✅ Бүртгэх</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f0e8", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#2d5016", marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#555", marginTop: 16, marginBottom: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd",
  },
  chipActive: { backgroundColor: "#2d5016", borderColor: "#2d5016" },
  chipText: { color: "#333", fontWeight: "500" },
  chipTextActive: { color: "#fff" },
  eventRow: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    padding: 14, borderRadius: 10, marginBottom: 6,
  },
  eventRowActive: { backgroundColor: "#e8f5e9", borderWidth: 1, borderColor: "#2d5016" },
  eventEmoji: { fontSize: 22, marginRight: 12 },
  eventLabel: { fontSize: 16, color: "#333" },
  eventLabelActive: { color: "#2d5016", fontWeight: "bold" },
  input: {
    backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd", borderRadius: 10,
    padding: 14, fontSize: 16,
  },
  submitBtn: {
    backgroundColor: "#2d5016", padding: 18, borderRadius: 12,
    alignItems: "center", marginTop: 24, marginBottom: 40,
  },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
