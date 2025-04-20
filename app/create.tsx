import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'expo-router';

import { GET_AUTHORS } from '@/src/graphql/authors.queries';
import { CREATE_BOOK } from '@/src/graphql/books.queries';

export default function CreateBookScreen() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    genre: '',
    publishedYear: '',
    rating: '',
    isPublished: false,
    authorId: '',
  });

  const { data: authorsData, loading: authorsLoading, error: authorsError } = useQuery(GET_AUTHORS, {
    variables: { limit: 100 },
  });

  const [createBook, { loading: creating }] = useMutation(CREATE_BOOK, {
    onCompleted: () => {
      Alert.alert('Başarılı', 'Kitap eklendi!');
      router.back();
    },
    onError: (err) => {
      Alert.alert('Hata', err.message);
    },
  });

  const authors = authorsData?.getAuthors || [];

  const handleSubmit = () => {
    if (!form.title || !form.genre || !form.publishedYear || !form.authorId) {
      return Alert.alert('Eksik Alan', 'Lütfen zorunlu alanları doldurun.');
    }

    createBook({
      variables: {
        data: {
          title: form.title,
          genre: form.genre,
          publishedYear: parseInt(form.publishedYear, 10),
          rating: parseFloat(form.rating),
          isPublished: form.isPublished,
          authorId: parseInt(form.authorId, 10),
        },
      },
    });
  };

  if (authorsLoading) return <ActivityIndicator style={styles.loader} />;
  if (authorsError) return <Text>Yazarlar yüklenemedi: {authorsError.message}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Başlık *</Text>
      <TextInput
        style={styles.input}
        placeholder="Kitap başlığı"
        value={form.title}
        onChangeText={(text) => setForm({ ...form, title: text })}
      />

      <Text style={styles.label}>Tür *</Text>
      <TextInput
        style={styles.input}
        placeholder="Roman, Tarih, Bilim..."
        value={form.genre}
        onChangeText={(text) => setForm({ ...form, genre: text })}
      />

      <Text style={styles.label}>Yayın Yılı *</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.publishedYear}
        onChangeText={(text) => setForm({ ...form, publishedYear: text })}
      />

      <Text style={styles.label}>Puan (0-5)</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        value={form.rating}
        onChangeText={(text) => setForm({ ...form, rating: text })}
      />

      <Text style={styles.label}>Yazar *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={form.authorId}
          onValueChange={(value) => setForm({ ...form, authorId: value })}
        >
          <Picker.Item label="Yazar seçin..." value="" />
          {authors.map((author: { id: React.Key; name: string; }) => (
            <Picker.Item key={author.id} label={author.name} value={author.id.toString()} />
          ))}
        </Picker>
      </View>

      <Button title="Kitap Oluştur" onPress={handleSubmit} disabled={creating} />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center' },
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { marginTop: 12, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginTop: 4,
    marginBottom: 16,
  },
});
