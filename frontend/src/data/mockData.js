// Danh sách các danh mục sản phẩm
export const categories = [
  { id: 'laptop', name: 'Laptop - Máy tính xách tay', icon: '💻' },
  { id: 'phone', name: 'Điện thoại Smartphone', icon: '📱' },
  { id: 'audio', name: 'Âm thanh - Tai nghe', icon: '🎧' },
  { id: 'accessory', name: 'Phụ kiện (Chuột, Phím)', icon: '🖱️' },
];

export const mockProducts = [
  {
    id: 1,
    category: 'laptop', // <-- Thêm trường này
    name: 'Laptop Gaming Acer Nitro 5 Tiger (Intel Core i5)',
    price: 21990000,
    oldPrice: 24990000,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&w=600&q=80',
    description: 'Chiếc laptop gaming quốc dân...',
    specs: [ { label: 'CPU', value: 'Intel Core i5 12500H' }, { label: 'RAM', value: '8GB DDR4 3200MHz' } ]
  },
  {
    id: 2,
    category: 'phone', // <-- Thêm trường này
    name: 'Điện thoại iPhone 15 Pro Max 256GB Titan Tự Nhiên',
    price: 29500000,
    oldPrice: 34990000,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&w=600&q=80',
    description: 'Siêu phẩm flagship từ Apple...',
    specs: [ { label: 'Màn hình', value: '6.7 inch' }, { label: 'Chip', value: 'Apple A17 Pro' } ]
  },
  {
    id: 3,
    category: 'audio', // <-- Thêm trường này
    name: 'Tai nghe Bluetooth Apple AirPods Pro Gen 2',
    price: 5490000,
    oldPrice: null,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?ixlib=rb-4.0.3&w=600&q=80',
    description: 'Trải nghiệm âm thanh đắm chìm...',
    specs: [ { label: 'Chống ồn', value: 'Chủ động (ANC)' } ]
  },
  {
    id: 4,
    category: 'accessory', // <-- Thêm trường này
    name: 'Chuột Không Dây Logitech MX Master 3S',
    price: 2450000,
    oldPrice: 2800000,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c90e7?ixlib=rb-4.0.3&w=600&q=80',
    description: 'Biểu tượng của sự sáng tạo...',
    specs: [ { label: 'Kết nối', value: 'Bluetooth' }, { label: 'DPI', value: '200 - 8000' } ]
  }
];