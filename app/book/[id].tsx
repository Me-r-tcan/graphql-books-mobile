import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@apollo/client';
import { GET_BOOK_BY_ID } from '@/src/graphql/books.queries';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams();
  const numericId = parseInt(id as string, 10);

  const { data, loading, error } = useQuery(GET_BOOK_BY_ID, {
    variables: { id: numericId },
    skip: isNaN(numericId),
  });

  if (loading) return <ActivityIndicator style={styles.loader} />;
  if (error) return <Text style={styles.error}>Hata: {error.message}</Text>;
  if (!data?.getBookById) return <Text style={styles.error}>Kitap bulunamadı.</Text>;

  const book = data.getBookById;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>Yazar: {book.author?.name}</Text>
      <Text style={styles.text}>Tür: {book.genre}</Text>
      <Text style={styles.text}>Yayın Yılı: {book.publishedYear}</Text>
      <Text style={styles.text}>Puan: {book.rating}</Text>
      <Text style={styles.text}>
        Yayında mı: {book.isPublished ? 'Evet' : 'Hayır'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center' },
  error: { margin: 16, color: 'red' },
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  author: { fontSize: 18, marginBottom: 12, color: '#555' },
  text: { fontSize: 16, marginBottom: 8 },
});
