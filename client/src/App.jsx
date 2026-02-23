import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import './index.css';
import Navbar from './components/Navbar';
import ProductExplorer from './pages/ProductExplorer';
import SavedProducts from './pages/SavedProducts';
import { SavedProductsProvider } from './hooks/useSavedProducts';

function App() {
  return (
    <SavedProductsProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<ProductExplorer />} />
              <Route path="/saved" element={<SavedProducts />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </SavedProductsProvider>
  );
}

export default App;
