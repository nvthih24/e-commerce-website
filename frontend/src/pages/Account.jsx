import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

export default function Account() {
  const { user, login, logout } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
      if (location.state?.tab) {
          setActiveTab(location.state.tab);
          }
      }, [location.state]);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { wishlist } = useWishlist();

  // ==========================================
  // STATE: QUẢN LÝ SỔ ĐỊA CHỈ
  // ==========================================
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: user?.name || 'Nguyễn Văn Thịnh',
      phone: '0987654321',
      street: 'Trường ĐH HUTECH, Khu Công nghệ cao, Phường Long Thạnh Mỹ, TP. Thủ Đức, TP.HCM',
      isDefault: true
    },
    {
      id: 2,
      name: user?.name || 'Nguyễn Văn Thịnh',
      phone: '0912345678',
      street: '475A Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP.HCM',
      isDefault: false
    }
  ]);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // State lưu trữ dữ liệu đang nhập trong Modal
  const [addressForm, setAddressForm] = useState({ name: '', phone: '', street: '', isDefault: false });

  // State cờ hiệu: null = Thêm mới, có ID = Đang cập nhật
  const [editingId, setEditingId] = useState(null);

const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user?.name || '',
      phone: user?.phone || '0987654321', // Lấy sđt từ Context
      email: user?.email || '', // Email giờ có thể rỗng
    }
  });

const onSubmitProfile = (data) => {
    // Lưu lại Tên và Email mới, số điện thoại không đổi
    login({ ...user, name: data.fullName, email: data.email });
    toast.success('Cập nhật hồ sơ thành công! ✨');
  };

  // Hàm mở Modal để THÊM MỚI
  const openAddModal = () => {
    setEditingId(null); // Báo là đang thêm mới
    setAddressForm({ name: '', phone: '', street: '', isDefault: false }); // Xóa trắng form
    setIsAddressModalOpen(true);
  };

  // Hàm mở Modal để CẬP NHẬT
  const openEditModal = (address) => {
    setEditingId(address.id); // Báo là đang cập nhật cái địa chỉ này
    setAddressForm(address); // Đổ dữ liệu cũ vào form
    setIsAddressModalOpen(true);
  };

  // Hàm Đóng Modal
  const closeAddressModal = () => {
    setIsAddressModalOpen(false);
    setEditingId(null);
    setAddressForm({ name: '', phone: '', street: '', isDefault: false });
  };

  // Hàm xử lý Lưu (Gộp chung logic Thêm mới và Cập nhật)
  const handleSaveAddress = (e) => {
    e.preventDefault();

    if (editingId) {
      // 1. LOGIC CẬP NHẬT
      let updatedAddresses = addresses.map(a =>
        a.id === editingId ? { ...addressForm, id: editingId } : a
      );

      // Nếu người dùng tick chọn mặc định, hủy mặc định các địa chỉ khác
      if (addressForm.isDefault) {
        updatedAddresses = updatedAddresses.map(a => ({
          ...a,
          isDefault: a.id === editingId
        }));
      }
      setAddresses(updatedAddresses);
      toast.success('Đã cập nhật địa chỉ! 📝');

    } else {
      // 2. LOGIC THÊM MỚI
      const newId = Date.now();
      const addressToAdd = { ...addressForm, id: newId };

      if (addressToAdd.isDefault || addresses.length === 0) {
        addressToAdd.isDefault = true;
        setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(addressToAdd));
      } else {
        setAddresses(prev => [...prev, addressToAdd]);
      }
      toast.success('Đã thêm địa chỉ mới! 📍');
    }

    closeAddressModal();
  };

  // Hàm set Mặc định nhanh ở ngoài
  const setAsDefault = (id) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    toast.success('Đã cập nhật địa chỉ mặc định!');
  };

  // Hàm Xóa địa chỉ
  const deleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast.success('Đã xóa địa chỉ!');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // DỮ LIỆU GIẢ LẬP HẠNG THÀNH VIÊN CELLPHONES
  const totalSpent = 8500000;
  const totalPoints = 109;
  const membershipTiers = [
    { id: 'member', name: 'MEMBER', min: 0, max: 6000000, color: 'from-zinc-400 to-zinc-500', icon: 'samplesm', discount: 'Giảm đến 1%' },
    { id: 'sgold', name: 'S-GOLD', min: 6000000, max: 25000000, color: 'from-amber-400 via-yellow-500 to-amber-600', icon: 'samplesgold', discount: 'Giảm đến 2%' },
    { id: 'splatinum', name: 'S-PLATINUM', min: 25000000, max: 999999999, color: 'from-cyan-300 via-sky-500 to-blue-600', icon: 'samplesplatinum', discount: 'Giảm đến 5%' },
  ];
  const currentTierIndex = membershipTiers.findIndex(t => totalSpent >= t.min && totalSpent < t.max);
  const currentTier = membershipTiers[currentTierIndex];
  const nextTier = membershipTiers[currentTierIndex + 1];
  const progressPercent = nextTier ? ((totalSpent - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100;

  if (!user) {
      return <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          tab: location.state?.tab
        }}
      />;
    }

  return (
    <div className="pb-10 relative">
      <div className="flex flex-col md:flex-row gap-8">

        {/* ================= SIDEBAR ================= */}
        <div className="w-full md:w-1/4 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
              <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full shadow-sm border border-gray-100 bg-gray-50" />
              <div>
                <p className="text-gray-500 text-sm mb-1">Tài khoản của</p>
                <h3 className="font-bold text-gray-800 text-lg leading-none">{user.name}</h3>
              </div>
            </div>
            <nav className="space-y-2">
              <button onClick={() => setActiveTab('profile')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3 ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                👤 Hồ sơ & Địa chỉ
              </button>
              <button onClick={() => setActiveTab('membership')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3 ${activeTab === 'membership' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                💎 Hạng thành viên TechStore
              </button>
              <button onClick={() => setActiveTab('orders')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3 ${activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                📦 Quản lý đơn hàng
              </button>
              <button onClick={() => setActiveTab('wishlist')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3 ${activeTab === 'wishlist' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                ❤️ Danh sách yêu thích
              </button>
              <button onClick={() => setIsLogoutModalOpen(true)} className="w-full text-left px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3 mt-4 border-t border-gray-50 pt-4">
                🚪 Đăng xuất
              </button>
            </nav>
          </div>
        </div>

        {/* ================= KHUNG NỘI DUNG ================= */}
        <div className="flex-1 w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 h-full min-h-[500px]">

            {/* TAB: THÔNG TIN CÁ NHÂN & SỔ ĐỊA CHỈ */}
            {activeTab === 'profile' && (
              <div className="max-w-4xl animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Hồ sơ của tôi</h2>

                {/* 1. Form cơ bản */}
                <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6 max-w-2xl mb-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Họ và Tên</label>
                                        <input type="text" {...register("fullName", { required: "Vui lòng nhập họ tên" })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                                      </div>

                                      {/* SỐ ĐIỆN THOẠI BỊ KHÓA VÌ LÀ TÀI KHOẢN ĐĂNG NHẬP */}
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại (Tài khoản)</label>
                                        <input
                                          type="text"
                                          disabled
                                          {...register("phone")}
                                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                                          title="Số điện thoại là tài khoản đăng nhập, không thể thay đổi"
                                        />
                                      </div>
                                    </div>

                                    {/* EMAIL ĐƯỢC MỞ KHÓA CHO PHÉP NHẬP */}
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ Email (Tùy chọn)</label>
                                      <input
                                        type="email"
                                        placeholder="Nhập email để nhận thông báo khuyến mãi"
                                        {...register("email")}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                                      />
                                    </div>
                  <button type="submit" className="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                    Lưu hồ sơ
                  </button>
                </form>

                {/* 2. Sổ địa chỉ (Address Book) */}
                <div className="pt-8 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h3 className="text-xl font-bold text-gray-800">Sổ địa chỉ</h3>
                    <button
                      type="button"
                      onClick={openAddModal} // Gọi hàm Mở để Thêm
                      className="bg-blue-50 text-blue-600 font-bold px-5 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <span className="text-xl leading-none">+</span> Thêm địa chỉ mới
                    </button>
                  </div>

                  <div className="space-y-4">
                    {addresses.map(addr => (
                      <div key={addr.id} className="p-5 border border-gray-200 rounded-2xl bg-white hover:border-blue-300 transition-colors flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-gray-800 border-r border-gray-300 pr-3">{addr.name}</span>
                            <span className="text-gray-600">{addr.phone}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{addr.street}</p>
                          {addr.isDefault && (
                            <span className="inline-block mt-3 px-2.5 py-1 text-xs font-bold text-red-500 border border-red-500 rounded-md">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-end justify-between min-w-[140px]">
                          <div className="flex gap-4 text-sm font-medium mb-3 md:mb-0">
                            {/* Nút Cập nhật đã được nối dây */}
                            <button
                              type="button"
                              onClick={() => openEditModal(addr)}
                              className="text-blue-600 hover:underline"
                            >
                              Cập nhật
                            </button>
                            {!addr.isDefault && (
                              <button type="button" onClick={() => deleteAddress(addr.id)} className="text-red-500 hover:underline">Xóa</button>
                            )}
                          </div>
                          {!addr.isDefault && (
                            <button
                              type="button"
                              onClick={() => setAsDefault(addr.id)}
                              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors bg-white"
                            >
                              Thiết lập mặc định
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: HẠNG THÀNH VIÊN */}
            {activeTab === 'membership' && (
              <div className="max-w-7xl animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span>💎</span> Hạng thành viên TechStore
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-8">
                    <div className={`p-8 rounded-3xl text-white shadow-xl bg-gradient-to-r ${currentTier.color} relative overflow-hidden h-[240px]`}>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
                      <div className="absolute top-6 left-6 text-white/90 text-sm font-bold uppercase tracking-wider">TechStore</div>
                      <div className="relative z-10 flex flex-col h-full justify-between pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white/80 font-medium mb-1 text-sm">Cấp bậc của bạn</p>
                            <h3 className="text-4xl font-black uppercase tracking-wider text-white shadow-sm drop-shadow">{currentTier.name}</h3>
                          </div>
                          <div className="w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/50">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=samplesm_qr" alt="QR" className="w-full h-full object-contain" />
                          </div>
                        </div>
                        <div className="flex justify-between items-end text-sm font-medium">
                          <span>Họ và Tên: {user.name}</span>
                          <span>Điểm: {totalPoints}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm relative">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">Hành trình thăng hạng</h3>
                      <div className="flex items-center gap-4 mb-3">
                         <div className={`p-3 rounded-full text-white bg-gradient-to-r ${currentTier.color} text-2xl drop-shadow-sm`}>{currentTier.icon === 'samplesm' ? '🥉' : currentTier.icon === 'samplesgold' ? '🥈' : '🥇'}</div>
                         <p className="font-medium text-gray-700">Tích lũy thêm: <span className='font-bold text-red-500'>{formatPrice(nextTier ? nextTier.min - totalSpent : 0)}</span></p>
                      </div>
                      <p className='text-xs text-gray-500 font-bold uppercase tracking-wider mb-2'>{currentTier.name}</p>
                      <div className="w-full bg-gray-100 rounded-full h-4 mb-1 overflow-hidden">
                        <div className="bg-red-500 h-4 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 font-bold mt-1">
                        <span>{formatPrice(currentTier.min)}</span>
                        <span>{nextTier ? formatPrice(nextTier.min) : 'Max'}</span>
                      </div>
                      <div className='absolute top-3 right-3 p-3 bg-red-100 rounded-full text-red-600 text-3xl font-black drop-shadow-sm'>🥇</div>
                    </div>
                  </div>
                  <div className="space-y-8">
                     <h3 className="text-lg font-bold text-gray-800">Đặc quyền {currentTier.name} của bạn</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 border border-red-200 bg-red-50 rounded-2xl flex items-center gap-3">
                          <div className="text-3xl">🎟️</div>
                          <div><h4 className="font-bold text-gray-800 text-sm">{currentTier.name} Giảm đến 2%</h4><p className="text-xs text-gray-500 mt-1">Khi mua sản phẩm Apple, Samsung...</p></div>
                        </div>
                        <div className="p-5 border border-red-200 bg-red-50 rounded-2xl flex items-center gap-3 shadow-sm">
                          <div className="text-3xl">Day</div>
                          <div><h4 className="font-bold text-gray-800 text-sm">{currentTier.name} Day ưu đãi đặc biệt</h4><p className="text-xs text-gray-500 mt-1">Giảm thêm 5% ngày hội thành viên.</p></div>
                        </div>
                        <div className="p-5 border border-gray-100 bg-gray-50 rounded-2xl flex items-center gap-3">
                          <div className="text-3xl">🚚</div>
                          <div><h4 className="font-bold text-gray-800 text-sm">Freeship mọi đơn</h4><p className="text-xs text-gray-500 mt-1">Giảm tối đa 30K phí vận chuyển.</p></div>
                        </div>
                        <div className="p-5 border border-gray-100 bg-gray-50 rounded-2xl flex items-center gap-3">
                          <div className="text-3xl">📞</div>
                          <div><h4 className="font-bold text-gray-800 text-sm">Hỗ trợ ưu tiên</h4><p className="text-xs text-gray-500 mt-1">Kênh CSKH riêng biệt, nhanh chóng.</p></div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ĐƠN HÀNG */}
            {activeTab === 'orders' && (
              <div className="animate-fadeIn">
                 <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><span>📦</span> Quản lý đơn hàng</h2>
                 <p className="text-gray-500">Danh sách đơn hàng của bạn...</p>
              </div>
            )}

            {/* TAB: YÊU THÍCH */}
            {activeTab === 'wishlist' && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><span>❤️</span> Sản phẩm yêu thích</h2>
                {wishlist.length === 0 ? (
                  <p className="text-gray-500">Bạn chưa có sản phẩm yêu thích nào.</p>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map(product => <ProductCard key={product.id} product={product} />)}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL THÊM/CẬP NHẬT ĐỊA CHỈ */}
      {/* ========================================= */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              {/* Đổi Title linh hoạt dựa vào state editingId */}
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
              </h2>
              <button onClick={closeAddressModal} className="text-gray-400 hover:text-red-500 text-3xl leading-none">&times;</button>
            </div>

            <form onSubmit={handleSaveAddress} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input type="text" placeholder="Họ và tên" required value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white" />
                </div>
                <div>
                  <input type="text" placeholder="Số điện thoại" required pattern="[0-9]{10}" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white" />
                </div>
              </div>
              <div>
                <textarea rows="3" placeholder="Địa chỉ cụ thể (Số nhà, tên đường, phường/xã...)" required value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-50 focus:bg-white"></textarea>
              </div>
              <label className="flex items-center gap-3 cursor-pointer mt-2 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <input type="checkbox" checked={addressForm.isDefault} onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" />
                <span className="text-gray-700 font-medium">Đặt làm địa chỉ mặc định</span>
              </label>
              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                <button type="button" onClick={closeAddressModal} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors">Trở lại</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 shadow-md transition-colors">
                  Hoàn thành
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ĐĂNG XUẤT */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full animate-fadeIn">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-6"><span className="text-3xl">🚪</span></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Bạn muốn đăng xuất?</h3>
              <p className="text-gray-500 mb-8 text-sm">Bạn có chắc chắn muốn đăng xuất không?</p>
              <div className="flex gap-3">
                <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200">Ở lại</button>
                <button onClick={logout} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600">Đăng xuất</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}