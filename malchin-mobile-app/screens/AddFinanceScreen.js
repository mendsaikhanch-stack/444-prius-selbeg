import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert,
} from "react-native";
import API from "../api/api";

const INCOME_CATEGORIES = ["Ноолуур", "Мах", "Сүү", "Ноос", "Арьс шир", "Мал зарсан", "Бусад"];
const EXPENSE_CATEGORIES = ["Тэжээл", "Эм", "Тээвэр", "Хашаа", "Түлш", "Ажилчин", "Бусад"];

export default function AddFinanceScreen({ navigation }) {
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const saveRecord = async () => {
    if (!category || !amount) {
      Alert.alert("Алдаа", "Ангилал, дүн оруулна уу");
      return;
    }
    try {
      await API.post("/finance/add", {
        user_id: 1,
        type,
        category,
        amount: parseInt(amount),
        note,
      });
      Alert.alert("Амжилттай", "Бүртгэгдлээ", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert("Анхааруулга", "Offline хадгалагдлаа");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Төрөл</Text>
      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[styles.typeBtn, type === "income" && styles.typeBtnIncome]}
          onPress={() => { setType("income"); setCategory(""); }}
        >
          <Text style={[styles.typeText, type === "income" && { color: "#fff" }]}>
            📈 Орлого
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeBtn, type === "expense" && styles.typeBtnExpense]}
          onPress={() => { setType("expense"); setCategory(""); }}
        >
          <Text style={[styles.typeText, type === "expense" && { color: "#fff" }]}>
            📉 Зардал
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Ангилал</Text>
      <View style={styles.chipRow}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, category === c && styles.chipActive]}
            onPress={() => setCategory(c)}
          >
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Дүн (₮)</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="3200000"
      />

      <Text style={styles.label}>Тэмдэглэл</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={note}
        onChangeText={setNote}
        placeholder="Нэмэлт мэдээлэл..."
        multiline
      />

      <TouchableOpacity style={styles.submitBtn} onPress={saveRecord}>
        <Text style={styles.submitText}>✅ Бүртгэх</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f0e8", padding: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#555", marginTop: 16, marginBottom: 8 },
  typeRow: { flexDirection: "row", gap: 10 },
  typeBtn: {
    flex: 1, padding: 14, borderRadius: 12, backgroundColor: "#fff",
    alignItems: "center", borderWidth: 1, borderColor: "#ddd",
  },
  typeBtnIncome: { backgroundColor: "#2e7d32", borderColor: "#2e7d32" },
  typeBtnExpense: { backgroundColor: "#c62828", borderColor: "#c62828" },
  typeText: { fontSize: 16, fontWeight: "600", color: "#333" },
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
    backgroundColor: "#2d5016", padding: 18, borderRadius: 12,
    alignItems: "center", marginTop: 24, marginBottom: 40,
  },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
