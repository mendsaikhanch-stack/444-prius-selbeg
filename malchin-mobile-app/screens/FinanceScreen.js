import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from "react-native";

const SAMPLE_RECORDS = [
  { id: 1, type: "income", category: "Ноолуур", amount: 3200000, record_date: "2026-03-10" },
  { id: 2, type: "income", category: "Мах", amount: 1500000, record_date: "2026-03-05" },
  { id: 3, type: "expense", category: "Тэжээл", amount: 450000, record_date: "2026-03-01" },
  { id: 4, type: "expense", category: "Эм", amount: 120000, record_date: "2026-02-28" },
  { id: 5, type: "income", category: "Сүү", amount: 280000, record_date: "2026-02-25" },
  { id: 6, type: "expense", category: "Тээвэр", amount: 350000, record_date: "2026-02-20" },
];

export default function FinanceScreen({ navigation }) {
  const [records] = useState(SAMPLE_RECORDS);

  const totalIncome = records
    .filter((r) => r.type === "income")
    .reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = records
    .filter((r) => r.type === "expense")
    .reduce((sum, r) => sum + r.amount, 0);
  const profit = totalIncome - totalExpense;

  const formatPrice = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "₮";

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>💰 Санхүүгийн тойм</Text>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: "#e8f5e9" }]}>
          <Text style={styles.summaryLabel}>Орлого</Text>
          <Text style={[styles.summaryValue, { color: "#2e7d32" }]}>{formatPrice(totalIncome)}</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: "#ffebee" }]}>
          <Text style={styles.summaryLabel}>Зардал</Text>
          <Text style={[styles.summaryValue, { color: "#c62828" }]}>{formatPrice(totalExpense)}</Text>
        </View>
      </View>

      <View style={styles.profitCard}>
        <Text style={styles.profitLabel}>Цэвэр ашиг</Text>
        <Text style={[styles.profitValue, { color: profit >= 0 ? "#2e7d32" : "#c62828" }]}>
          {profit >= 0 ? "+" : ""}{formatPrice(profit)}
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Сүүлийн бүртгэлүүд</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate("AddFinance")}
        >
          <Text style={styles.addBtnText}>+ Нэмэх</Text>
        </TouchableOpacity>
      </View>

      {records.map((item) => (
        <View key={item.id} style={styles.recordRow}>
          <Text style={styles.recordIcon}>
            {item.type === "income" ? "📈" : "📉"}
          </Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.recordCategory}>{item.category}</Text>
            <Text style={styles.recordDate}>{item.record_date}</Text>
          </View>
          <Text
            style={[
              styles.recordAmount,
              { color: item.type === "income" ? "#2e7d32" : "#c62828" },
            ]}
          >
            {item.type === "income" ? "+" : "-"}{formatPrice(item.amount)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f0e8", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#2d5016", marginBottom: 16, marginTop: 10 },
  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  summaryCard: { flex: 1, padding: 16, borderRadius: 14, alignItems: "center" },
  summaryLabel: { fontSize: 13, color: "#555" },
  summaryValue: { fontSize: 18, fontWeight: "bold", marginTop: 6 },
  profitCard: {
    backgroundColor: "#fff", padding: 20, borderRadius: 14,
    alignItems: "center", marginBottom: 20, elevation: 2,
  },
  profitLabel: { fontSize: 14, color: "#777" },
  profitValue: { fontSize: 28, fontWeight: "bold", marginTop: 4 },
  sectionHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  addBtn: { backgroundColor: "#2d5016", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  recordRow: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    padding: 14, borderRadius: 10, marginBottom: 8, elevation: 1,
  },
  recordIcon: { fontSize: 22, marginRight: 12 },
  recordCategory: { fontSize: 15, fontWeight: "600", color: "#333" },
  recordDate: { fontSize: 12, color: "#999", marginTop: 2 },
  recordAmount: { fontSize: 16, fontWeight: "bold" },
});
