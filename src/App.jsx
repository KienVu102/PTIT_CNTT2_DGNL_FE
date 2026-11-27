import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import TrangDanhSach from './pages/TrangDanhSach';
import TrangForm from './pages/TrangForm';

export default function App() {
  const [thongBao, setThongBao] = useState('');

  function hienThongBao(noiDung) {
    setThongBao(noiDung);
    setTimeout(() => {
      setThongBao('');
    }, 3000);
  }

  return (
    <div>
      <header className="dau-trang">OfficeMart Admin</header>

      <main className="khung">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<TrangDanhSach hienThongBao={hienThongBao} />} />
          <Route path="/products/new" element={<TrangForm hienThongBao={hienThongBao} />} />
          <Route path="/products/:id/edit" element={<TrangForm hienThongBao={hienThongBao} />} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </main>

      {thongBao && (
        <div className="thong-bao" data-testid="toast">
          {thongBao}
        </div>
      )}
    </div>
  );
}
