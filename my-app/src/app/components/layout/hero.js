import Right from "../icons/right";
export default function Hero() {
  const somtum = "https://images.deliveryhero.io/image/foodpanda/recipes/green-papaya-salad.jpg";
  return (
    <section className="hero mt-1">
      <div className="py-8 md:py-12 text-center">
        <h1 className="text-4xl font-semibold">
        ทุกอย่าง <br />
          ดีขึ้น<br />
          ด้วย &nbsp;
          <span className="text-primary">ข้าวมันไก่ทอด</span>
        </h1>
        <p className="my-6 text-gray-500 text-sm">
          Pizza is the missing piece that makes every day complete, a simple yet delicious joy in life
        </p>
        <div className="flex justify-center gap-4 text-sm">
          <button className="flex justify-center bg-primary uppercase items-center gap-2 text-white px-4 py-2 rounded-full">
            สั่งตอนนี้
            <Right />
          </button>
          <button className="flex items-center border-0 gap-2 py-2 text-gray-600 font-semibold">
            เรียนรู้เพิ่มเติม
            <Right />
          </button>
        </div>
      </div>
      
      {/* Image section, only visible on larger screens */}
      <div className="relative hidden md:block mt-0">
        <div className="relative w-full h-96">
          <img 
            src={somtum}
            alt="Delicious pizza" 
            layout="fill" 
            className="rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
