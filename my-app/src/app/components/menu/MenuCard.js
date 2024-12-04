'use client';

import { Card, CardHeader, CardBody, CardFooter, Button } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MenuCard({ item, onAddToCart }) {
  const router = useRouter();

  const handleAddToCart = () => {
    // เพิ่มสินค้าลงตะกร้า
    onAddToCart(item);
    // แสดง notification หรือ feedback ให้ผู้ใช้ทราบ
    alert('เพิ่มสินค้าลงตะกร้าแล้ว');
  };

  return (
    <Card className="w-full max-w-[300px]">
      <CardHeader className="p-0">
        <Image
          src={item.image || '/images/default-food.jpg'}
          alt={item.name}
          width={300}
          height={200}
          className="object-cover w-full h-[200px]"
        />
      </CardHeader>
      <CardBody className="text-center">
        <h3 className="text-xl font-bold mb-2">{item.name}</h3>
        <p className="text-gray-600">{item.description}</p>
        <p className="text-lg font-semibold mt-2">{item.price} บาท</p>
      </CardBody>
      <CardFooter className="flex justify-between">
        <Button 
          color="primary"
          onClick={handleAddToCart}
          className="w-full"
        >
          เพิ่มลงตะกร้า
        </Button>
      </CardFooter>
    </Card>
  );
}
