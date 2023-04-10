import React, { useEffect, useState } from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import Layout from '@/components/Layout.jsx';
import InfoCard from '@/components/InfoCard.jsx';
import { getAllBooks } from '@/modules/fetch';

function HomePage() {
  const [books, setBooks] = useState(null);
  useEffect(() => {
    const fetchBooks = async () => {
      const { books } = await getAllBooks();
      setBooks(books);
    };
    fetchBooks();
  }, []);

  return (
    <Layout>
      <SimpleGrid columns={4} spacing={6} justifyContent='center'>
        {books?.map((book, idx) => (
          <InfoCard key={idx} {...book} />
        ))}
      </SimpleGrid>
    </Layout>
  );
}

export default HomePage;
