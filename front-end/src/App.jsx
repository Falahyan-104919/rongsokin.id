import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { Layout } from './layout/Layout';
import { Profile } from './pages/Profile';
import ForumMitra from './pages/ForumMitra';
import ForumCustomer from './pages/ForumCustomer';
import { Order } from './pages/Order';
import { Transaction } from './pages/Transaction';
import ProductConfiguration from './pages/ProductConfiguration';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Product from './pages/Product';
import User from './pages/User';
import Mitra from './pages/Mitra';
import Search from './pages/Search';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path="products/:productId" element={<Product />} />
          <Route path="forum_customer" element={<ForumCustomer />} />
          <Route path="forum_mitra" element={<ForumMitra />} />
          <Route path="order/:userId" element={<Order />} />
          <Route path="transaction/:mitraId" element={<Transaction />} />
          <Route
            path="product_configuration/:mitraId"
            element={<ProductConfiguration />}
          />
          <Route path="user/:userId" element={<User />} />
          <Route path="mitra/:mitraId" element={<Mitra />} />
          <Route path="search" element={<Search />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
