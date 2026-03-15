import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl,
} from "react-native";
import API from "../api/api";

const SAMPLE_LISTINGS = [
  {
    id: 1, title: "100 хонь зарна", animal_type: "sheep", quantity: 100,
    price: 180000, location: "Архангай, Батцэнгэл", seller_name: "Бат",
  },
  {
    id: 2, title: "50 ямаа зарна", animal_type: "goat", quantity: 50,
    price: 150000, location: "Хөвсгөл, Мөрөн", seller_name: "Дорж",
  },
  {
    id: 3, title: "Ноолуур 200кг", category: "cashmere", quantity: 200,
    price: 95000, location: "Баянхонгор", seller_name: "Сүхээ",
  },
  {
    id: 4, title: "20 үхэр зарна", animal_type: "cattle", quantity: 20,
    price: 2500000, location: "Төв, Зуунмод", seller_name: "Ганбаатар",
  },
];

const ANIMAL_EMOJIS = {
  sheep: "🐑", goat: "🐐", cattle: "🐄", horse: "🐎", camel: "🐫",
};

export default function MarketScreen({ navigation }) {
  const [listings, setListings] = useState(SAMPLE_LISTINGS);
  const [refreshing, setRefreshing] = useState(false);

  const fetchListings = async () => {
    try {
      const res = await API.get("/market");
      if (res.data.length > 0) {
        setListings(res.data);
      }
    } catch {
      // Offline - sample data ашиглана
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "₮";
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>🛒 Малын зах зээл</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate("AddMarket")}
        >
          <Text style={styles.addBtnText}>+ Зар нэмэх</Text>
        </TouchableOpacity>
      </View>

      {listings.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>
              {ANIMAL_EMOJIS[item.animal_type] || "📦"}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardLocation}>📍 {item.location}</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>{formatPrice(item.price)}</Text>
            <Text style={styles.cardSeller}>👤 {item.seller_name}</Text>
          </View>
          <TouchableOpacity style={styles.contactBtn}>
            <Text style={styles.contactBtnText}>📞 Холбогдох</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f0e8" },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: 16, paddingTop: 10,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#2d5016" },
  addBtn: { backgroundColor: "#2d5016", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  addBtnText: { color: "#fff", fontWeight: "bold" },
  card: {
    backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 12,
    borderRadius: 14, padding: 16, elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  cardEmoji: { fontSize: 36, marginRight: 12 },
  cardTitle: { fontSize: 17, fontWeight: "bold", color: "#333" },
  cardLocation: { fontSize: 13, color: "#888", marginTop: 2 },
  cardFooter: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginBottom: 10,
  },
  cardPrice: { fontSize: 20, fontWeight: "bold", color: "#e65100" },
  cardSeller: { fontSize: 14, color: "#666" },
  contactBtn: {
    backgroundColor: "#e8f5e9", padding: 12, borderRadius: 10, alignItems: "center",
  },
  contactBtnText: { fontSize: 15, color: "#2d5016", fontWeight: "600" },
});
