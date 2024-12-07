import Header from "../components/Header";

export default function About() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
          <h1 className="text-4xl font-bold mb-8">เกี่ยวกับเรา</h1>
          <div className="bg-white/30 p-8 rounded-lg backdrop-blur-sm">
            <p className="mb-4">
               เราเป็นผู้ให้บริการที่มุ่งมั่นที่จะให้บริการที่ดีเยี่ยมและการแก้ปัญหาที่เป็นนวัตกรรม
            </p>
            <p className="mb-4">
              ทีมงานของเราคือมืออาชีพที่มีความหลงใหลในการทำงานและให้ผลลัพธ์ที่ดีที่สุดสำหรับลูกค้าของเรา
            </p>
            <p>
              คุณสามารถสำรวจเว็บไซต์ของเราและเรียนรู้เพิ่มเติมเกี่ยวกับสิ่งที่เรามีให้
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
