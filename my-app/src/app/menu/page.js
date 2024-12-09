'use client';

import { Card, CardBody, CardFooter, Image, Button, Input } from "@nextui-org/react";
import Header from '../components/Header';
import { useCart } from '../providers/CartProvider';
import { toast } from 'react-hot-toast';
import { menuItems } from "../data/menuItems";
import { useState } from "react";
import { useSession } from 'next-auth/react';

export default function MenuPage() {
  const { data: session } = useSession();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [type, setType] = useState('all');

  const handleAddToCart = (item) => {
    if (session) {
      addToCart(item);
      toast.success(`เพิ่ม ${item.name} ลงในตะกร้าแล้ว`);
    } else {
      toast.error('คุณต้อง login ก่อนเพิ่มสินค้าลงตะกร้า');
    }
  };

  const filteredMenuItems = menuItems.filter(item => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (type === 'all' || item.type === type) && lowerCaseName.includes(lowerCaseSearchTerm);
  });

  const sortedMenuItems = () => {
    switch (sortBy) {
      case 'name':
        return filteredMenuItems.sort((a, b) => a.name.localeCompare(b.name));
      case 'price':
        return filteredMenuItems.sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return filteredMenuItems.sort((a, b) => b.price - a.price);

      case 'type == 1':
        return filteredMenuItems.filter(item => item.type === '1');
      case 'type == 2':
        return filteredMenuItems.filter(item => item.type === '2');
      default:
        return filteredMenuItems;
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-8 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">เมนูอาหาร</h1>

          <div className="flex items-center justify-between mb-4">
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              placeholder="ค้นหาเมนู"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="ml-4 p-3 border rounded-lg"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">เรียงลำดับ</option>
              <option value="name">ชื่ออาหาร</option>
              <option value="price">ราคา น้อย-มาก</option>
              <option value="priceDesc">ราคา มาก-น้อย</option>
            </select>
          </div>
          <div className="flex items-center mb-4">
            ประเภท ของอาหาร{' '}
            <select
              className="ml-4 p-3 border rounded-lg"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="all">ทั้งหมด</option>
              <option value="1">ของคาว</option>
              <option value="2">ของหวาน</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMenuItems().map((item) => (
              <Card key={item.id} className="max-w-sm">
                <CardBody className="p-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                </CardBody>
                <CardFooter className="flex flex-col items-start">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  <div className="flex justify-between items-center w-full mt-4">
                    <span className="text-lg font-bold">{item.price} บาท</span>
                    <Button 
                      color="primary" 
                      onClick={() => handleAddToCart(item)}
                      className="hover:scale-105 transition-transform"
                    >
                      <span className='text-white'>เพิ่มลงตะกร้า</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}




