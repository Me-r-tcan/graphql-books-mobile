import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_BOOKS } from '@/src/graphql/books.queries';
import { useRouter } from 'expo-router';

export default function BookListScreen() {
  const limit = 10;
  const { data, loading, error, fetchMore } = useQuery(GET_BOOKS, {
    variables: { limit, offset: 0 },
    fetchPolicy: 'cache-and-network',
  });

  const books = data?.getBooks?.items || [];
  const router = useRouter();

  const handleLoadMore = () => {
    if (books.length >= data?.getBooks?.total) return;
    fetchMore({
      variables: {
        offset: books.length,
        limit,
      },
    });
  };

  if (loading && books.length === 0) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Bir hata oluştu: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push({
            pathname: '/book/[id]',
            params: { id: item.id.toString() },
          })}>
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author?.name}</Text>
          </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>Kayıtlı kitap yok.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 18, fontWeight: 'bold' },
  author: { color: '#666', marginTop: 4 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
