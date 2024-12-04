export default function MenuItem() {
    const imageUrl = "https://food.mthai.com/app/uploads/2017/11/Hainanese-chicken-rice.jpg";

    return (
        <div className="bg-gray-300 p-4 rounded-lg text-center group hover:bg-white 
        hover:shadow-md hover:shadow-black/25 transition-all">
            <img 
                src={imageUrl} 
                alt="Menu Item" 
                className="w-full h-40 object-cover rounded-lg mb-4" 
            />
            <h4 className="font-semibold text-xl mb-2">ข้าวมันไก่ทอด</h4>
            <p className="text-gray-500 text-sm mb-4">
                ข้าวมันหอมๆ ทานกับไก่ชุบแป้งทอดกรอบๆ และน้ำจิ้มไก่รสหวาน
            </p>
            <button className="bg-primary text-white rounded-full px-6 py-2">Add to cart 100 thb</button>
        </div>
    );
}
