// 1. MẢNG DANH MỤC
export const categories = [
  { id: 'laptop', name: 'Laptop - Máy tính xách tay', icon: '💻' },
  { id: 'phone', name: 'Điện thoại Smartphone', icon: '📱' },
  { id: 'audio', name: 'Âm thanh - Tai nghe', icon: '🎧' },
  { id: 'accessory', name: 'Phụ kiện (Chuột, Phím)', icon: '🖱️' },
];

// 2. MẢNG SẢN PHẨM (Đã nâng cấp phiên bản, màu sắc)
export const mockProducts = [
  {
    id: 1,
    category: 'laptop',
    name: 'Laptop Gaming Acer Nitro 5 Tiger',
    price: 21990000,
    oldPrice: 24990000,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&w=600&q=80',
    description: 'Chiếc laptop gaming quốc dân với cấu hình mạnh mẽ, tản nhiệt đỉnh cao 2 quạt thế hệ mới. Bàn phím LED RGB 4 vùng cực cháy, sẵn sàng chiến mọi tựa game AAA.',
    colors: [
      { id: 'black', name: 'Đen Thạch Anh', hex: '#1a1a1a' }
    ],
    variants: [
      { id: 'ram8', name: 'RAM 8GB - SSD 512GB', priceOffset: 0 },
      { id: 'ram16', name: 'RAM 16GB - SSD 512GB', priceOffset: 1500000 }
    ],
    specs: [
      { label: 'CPU', value: 'Intel Core i5 12500H' },
      { label: 'RAM', value: '8GB/16GB DDR4 3200MHz' },
      { label: 'Ổ cứng', value: '512GB PCIe NVMe SED SSD' },
      { label: 'VGA', value: 'NVIDIA GeForce RTX 3050 4GB' },
      { label: 'Màn hình', value: '15.6" FHD (1920 x 1080) IPS 144Hz' }
    ]
  },
  {
    id: 2,
    category: 'phone',
    name: 'Điện thoại iPhone 15 Pro Max',
    price: 29500000,
    oldPrice: 34990000,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&w=600&q=80',
    description: 'Siêu phẩm flagship từ Apple với khung viền Titanium siêu nhẹ, bền bỉ. Camera viễn vọng zoom quang học 5x sắc nét. Sức mạnh vô đối từ chip A17 Pro 3nm.',
    colors: [
      { id: 'titan-tu-nhien', name: 'Titan Tự Nhiên', hex: '#b5b6b1' },
      { id: 'titan-den', name: 'Titan Đen', hex: '#4c4c4e' },
      { id: 'titan-trang', name: 'Titan Trắng', hex: '#f2f1ed' },
      { id: 'titan-xanh', name: 'Titan Xanh', hex: '#3b4353' }
    ],
    variants: [
      { id: '256gb', name: '256GB', priceOffset: 0 },
      { id: '512gb', name: '512GB', priceOffset: 5000000 },
      { id: '1tb', name: '1TB', priceOffset: 11000000 }
    ],
    specs: [
      { label: 'Màn hình', value: '6.7 inch Super Retina XDR OLED 120Hz' },
      { label: 'Chip', value: 'Apple A17 Pro 6 nhân' },
      { label: 'RAM', value: '8 GB' },
      { label: 'Camera sau', value: 'Chính 48 MP & Phụ 12 MP, 12 MP' },
      { label: 'Camera trước', value: '12 MP' },
      { label: 'Pin, Sạc', value: '4422 mAh, 20W' }
    ]
  },
  {
    id: 3,
    category: 'audio',
    name: 'Tai nghe Bluetooth Apple AirPods Pro Gen 2',
    price: 5490000,
    oldPrice: null,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?ixlib=rb-4.0.3&w=600&q=80',
    description: 'Trải nghiệm âm thanh đắm chìm với công nghệ Chống ồn chủ động (ANC) tốt gấp 2 lần. Xuyên âm tự động và hộp sạc MagSafe tích hợp loa.',
    colors: [ { id: 'white', name: 'Trắng', hex: '#ffffff' } ],
    variants: [ { id: 'standard', name: 'Bản Tiêu Chuẩn', priceOffset: 0 } ],
    specs: [ { label: 'Chống ồn', value: 'Chủ động (ANC)' }, { label: 'Cổng sạc', value: 'Type-C' }, { label: 'Pin', value: '6 giờ (Tai nghe), 30 giờ (Hộp sạc)' } ]
  },
  {
    id: 4,
    category: 'accessory',
    name: 'Chuột Không Dây Logitech MX Master 3S',
    price: 2450000,
    oldPrice: 2800000,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c90e7?ixlib=rb-4.0.3&w=600&q=80',
    description: 'Biểu tượng của sự sáng tạo. Chuột cuộn MagSpeed siêu tốc, cảm biến 8000 DPI theo dõi trên mọi bề mặt kể cả kính.',
    colors: [
      { id: 'graphite', name: 'Xám Đen', hex: '#2c2c2c' },
      { id: 'pale-grey', name: 'Xám Nhạt', hex: '#d4d4d4' }
    ],
    variants: [ { id: 'standard', name: 'Bản Tiêu Chuẩn', priceOffset: 0 } ],
    specs: [ { label: 'Kết nối', value: 'Bluetooth / USB Logi Bolt' }, { label: 'DPI', value: '200 - 8000 DPI' }, { label: 'Nút bấm', value: '7 nút Quiet Clicks' } ]
  }
];