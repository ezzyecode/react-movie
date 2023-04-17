import React from 'react';
import MoviesList from '../components/MoviesList';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <MoviesList />
      <Footer />
    </div>
  );
}

export default Home;
