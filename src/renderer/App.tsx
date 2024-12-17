import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Requests from './pages/requests';
import Header from './components/Header';
import background from '../../assets/background.png';
import NewRequest from './pages/newRequest';
import Products from './pages/products';
import NewProduct from './pages/newProduct';
import Report from './pages/report';

export default function App() {
  return (
    <div className="layout">
      <Router>
        <Header />

        <div
          className="d-flex h-100 position-absolute"
          style={{ width: '100%', height: '100%' }}
        >
          <img
            src={background}
            alt="background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              zIndex: '100',
            }}
          />
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'black',
              opacity: 0.7,
              zIndex: '100',
            }}
          />
        </div>

        <div className="d-flex content">
          <Routes>
            <Route path="/" element={<Navigate to="/requests" />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/newRequest" element={<NewRequest />} />
            <Route path="/products" element={<Products />} />
            <Route path="/newProduct/:id" element={<NewProduct />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
