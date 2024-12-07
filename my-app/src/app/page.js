  import Hero from "./components/layout/hero";
  import HomeMenu from "./components/layout/homemenu";
  import SectionHeader from "./layout/SectionHeader";
  import Header from "./components/Header";

  export default function Home() {
    return (
      <>
      <Header />
        <main className="max-w-6xl mx-auto p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-8 h-screen">
          <Hero />
          <div className="mt-12">
            <SectionHeader title="Our Features" subTitle="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus, quod." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              <div className="text-gray-500 max-w-md mx-auto flex flex-col gap-4">
                <h2 className="text-xl font-bold">Quick Order</h2>
                <p>
                  การสั่งซื้อที่รวดเร็ว
                </p>
              </div>
              <div className="text-gray-500 max-w-md mx-auto flex flex-col gap-4">
                <h2 className="text-xl font-bold">Fast Delivery</h2>
                <p>
                  การจัดส่งที่รวดเร็ว
                </p>
              </div>
              <div className="text-gray-500 max-w-md mx-auto flex flex-col gap-4">
                <h2 className="text-xl font-bold">Secure Payment</h2>
                <p>
                  การชําระเงินที่ปลอดภัย
                </p>
              </div>
            </div>
          </div>

          <footer className="border-t mt-12 py-8 text-center text-gray-500 dark:text-gray-400">
            &copy; 2024 FOOD NEXT คนเขียนโครตหล่อ
          </footer>
        </main>
      </>
    );
  }
  /// 1:20:05 / 11:34:43
