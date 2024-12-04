'use client';

import { useCart } from '../providers/CartProvider';
import { Button } from "@nextui-org/react";
import Header from '../components/Header';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-8 h-screen">
        <h1 className="text-2xl font-bold mb-8">ตะกร้าสินค้า</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">ไม่มีสินค้าในตะกร้า</p>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">สินค้า</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ราคา</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">จำนวน</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">รวม</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{item.price} บาท</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                            className="px-2 py-1"
                          >
                            -
                          </Button>
                          <span className="text-sm text-gray-900 dark:text-gray-100 w-8 text-center">
                            {item.quantity || 1}
                          </span>
                          <Button 
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                            className="px-2 py-1"
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {item.price * (item.quantity || 1)} บาท
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          color="danger"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          ลบ
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-end">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <div className="text-lg font-semibold mb-4">
                  ยอดรวมทั้งหมด: {getCartTotal()} บาท
                </div>
                <Button 
                  color="primary"
                  size="lg"
                  className="w-full"
                >
                  ดำเนินการชำระเงิน
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      <footer className="border-t mt-12 py-8 text-center text-gray-500 dark:text-gray-400">
        &copy; 2024 FOOD NEXT คนเขียนโครตหล่อ
      </footer>
    </>
  );
}
