import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FAB, Card, IconButton, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { Transaction, TransactionType } from '../types/finance';

const categories = ['Salary', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Other'];

export default function FinanceScreen() {
  const { transactions, addTransaction, deleteTransaction, getBalance } = useFinance();
  const { colors } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [note, setNote] = useState('');

  const balance = getBalance();

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount))) return;
    await addTransaction({
      type,
      amount: Number(amount),
      category,
      note,
      date: new Date(),
    });
    setModalVisible(false);
    setAmount('');
    setNote('');
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <Card style={[styles.card, { backgroundColor: colors.card }]}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <MaterialIcons 
            name={item.type === 'income' ? 'arrow-upward' : 'arrow-downward'} 
            size={24} 
            color={item.type === 'income' ? '#4caf50' : '#f44336'} 
          />
        </View>
        <View style={styles.info}>
          <Text style={[styles.category, { color: colors.text }]}>{item.category}</Text>
          <Text style={[styles.note, { color: colors.subtext }]}>{item.note}</Text>
          <Text style={[styles.date, { color: colors.subtext }]}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, { color: item.type === 'income' ? '#4caf50' : '#f44336' }]}>
            {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
          </Text>
          <IconButton icon="delete" size={20} onPress={() => deleteTransaction(item.id)} />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <LinearGradient colors={colors.background} style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Finance</Text>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>${balance.total.toFixed(2)}</Text>
          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.balanceSubLabel}>Income</Text>
              <Text style={[styles.balanceSubValue, { color: '#4caf50' }]}>+${balance.income.toFixed(2)}</Text>
            </View>
            <View style={styles.half}>
              <Text style={styles.balanceSubLabel}>Expense</Text>
              <Text style={[styles.balanceSubValue, { color: '#f44336' }]}>-${balance.expense.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="account-balance-wallet" size={64} color={colors.subtext} />
            <Text style={[styles.emptyText, { color: colors.subtext }]}>No transactions yet</Text>
          </View>
        }
      />

      <FAB icon="plus" style={[styles.fab, { backgroundColor: colors.accent }]} onPress={() => setModalVisible(true)} color="#fff" />

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add Transaction</Text>
              <IconButton icon="close" onPress={() => setModalVisible(false)} />
            </View>

            <View style={styles.typeRow}>
              <TouchableOpacity style={[styles.typeBtn, type === 'expense' && styles.activeTypeBtn, { borderColor: '#f44336' }]} onPress={() => setType('expense')}>
                <Text style={{ color: type === 'expense' ? '#fff' : '#f44336' }}>Expense</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.typeBtn, type === 'income' && styles.activeTypeBtn, { borderColor: '#4caf50', backgroundColor: type === 'income' ? '#4caf50' : 'transparent' }]} onPress={() => setType('income')}>
                <Text style={{ color: type === 'income' ? '#fff' : '#4caf50' }}>Income</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.input, { backgroundColor: colors.background[0], borderColor: colors.border, color: colors.text }]}
              placeholder="Amount"
              placeholderTextColor={colors.subtext}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <View style={styles.pickerContainer}>
              <Text style={[styles.pickerLabel, { color: colors.subtext }]}>Category</Text>
              <Picker selectedValue={category} onValueChange={setCategory} style={{ color: colors.text }}>
                {categories.map(cat => <Picker.Item key={cat} label={cat} value={cat} />)}
              </Picker>
            </View>

            <TextInput
              style={[styles.input, { backgroundColor: colors.background[0], borderColor: colors.border, color: colors.text }]}
              placeholder="Note (optional)"
              placeholderTextColor={colors.subtext}
              value={note}
              onChangeText={setNote}
            />

            <TouchableOpacity onPress={handleSave} style={styles.addButton}>
              <LinearGradient colors={[colors.accent, '#764ba2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
                <Text style={styles.addButtonText}>Save</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16 },
  headerTitle: { fontSize: 32, fontWeight: '800', marginBottom: 16 },
  balanceCard: { backgroundColor: '#333', padding: 20, borderRadius: 16, elevation: 4 },
  balanceLabel: { color: '#aaa', fontSize: 14 },
  balanceValue: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginVertical: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  half: { flex: 1 },
  balanceSubLabel: { color: '#aaa', fontSize: 12 },
  balanceSubValue: { fontSize: 16, fontWeight: '600', marginTop: 4 },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { marginBottom: 12, borderRadius: 16 },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { padding: 8, borderRadius: 12, backgroundColor: '#f0f0f0', marginRight: 12 },
  info: { flex: 1 },
  category: { fontSize: 16, fontWeight: '600' },
  note: { fontSize: 14 },
  date: { fontSize: 12, marginTop: 4 },
  amountContainer: { alignItems: 'flex-end' },
  amount: { fontSize: 16, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 18, marginTop: 16 },
  fab: { position: 'absolute', right: 20, bottom: 20, borderRadius: 28 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 24, fontWeight: '700' },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  typeBtn: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  activeTypeBtn: { backgroundColor: '#f44336' },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 16 },
  pickerContainer: { marginBottom: 16 },
  pickerLabel: { fontSize: 12, marginBottom: 4 },
  addButton: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  gradientButton: { paddingVertical: 14, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
