import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import AddMovie from './pages/AddMovie';
import MovieEditPage from './pages/MovieEditPage';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/addMovie" component={AddMovie} />
        <Route path="/movie/edit/:movieId" component={MovieEditPage} />
      </Switch>
    </div>
  );
}

export default App;
