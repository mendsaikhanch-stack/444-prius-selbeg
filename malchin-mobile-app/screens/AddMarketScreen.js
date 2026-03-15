import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert,
} from "react-native";
import API from "../api/api";

const CATEGORIES = [
  { key: "livestock", label: "Мал" },
  { key: "cashmere", label: "Ноолуур" },
  { key: "wool", label: "Ноос" },
  { key: "milk", label: "Сүү" },
  { key: "hide", label: "Арьс шир" },
  { key: "meat", label: "Мах" },
];

export default function AddMarketScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("livestock");
  const [animalType, setAnimalType] = useState("sheep");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");

  const createListing = async () => {
    if (!title || !price) {
      Alert.alert("Алдаа", "Гарчиг, үнэ оруулна уу");
      return;
    }
    try {
      await API.post("/market/create", {
        user_id: 1,
        category,
        title,
        description,
        animal_type: animalType,
        quantity: parseInt(quantity) || 0,
        price: parseInt(price),
        location,
      });
      Alert.alert("Амжилттай", "Зар нэмэгдлээ", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert("Анхааруулга", "Offline хадгалагдлаа");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Ангилал</Text>
      <View style={styles.chipRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c.key}
            style={[styles.chip, category === c.key && styles.chipActive]}
            onPress={() => setCategory(c.key)}
          >
            <Text style={[styles.chipText, category === c.key && styles.chipTextActive]}>
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Гарчиг</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Жишээ: 100 хонь зарна"
      />

      <Text style={styles.label}>Дэлгэрэнгүй</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Нэмэлт мэдээлэл..."
        multiline
      />

      <Text style={styles.label}>Тоо ширхэг</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        placeholder="100"
      />

      <Text style={styles.label}>Үнэ (₮)</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder="180000"
      />

      <Text style={styles.label}>Байршил</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Архангай, Батцэнгэл"
      />

      <TouchableOpacity style={styles.submitBtn} onPress={createListing}>
        <Text style={styles.submitText}>🛒 Зар нийтлэх</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f0e8", padding: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#555", marginTop: 16, marginBottom: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd",
  },
  chipActive: { backgroundColor: "#2d5016", borderColor: "#2d5016" },
  chipText: { color: "#333" },
  chipTextActive: { color: "#fff" },
  input: {
    backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd", borderRadius: 10,
    padding: 14, fontSize: 16,
  },
  submitBtn: {
    backgroundColor: "#e65100", padding: 18, borderRadius: 12,
    alignItems: "center", marginTop: 24, marginBottom: 40,
  },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
