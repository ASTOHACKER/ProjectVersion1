import Hero from "./components/layout/hero";
import HomeMenu from "./components/layout/homemenu";
import SectionHeader from "./layout/SectionHeader";
import Header from "./components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-8">
        <Hero />
        <HomeMenu />
        <div className="mt-12">
          <SectionHeader title="Our Features" subTitle="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus, quod." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <div className="text-gray-500 max-w-md mx-auto flex flex-col gap-4">
              <h2 className="text-xl font-bold">Quick Order</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni minima odit recusandae. Illum ipsa non repudiandae? Eum ipsam iste quos suscipit tempora? Aperiam esse fugiat inventore laboriosam officiis quam rem!
              </p>
            </div>
            <div className="text-gray-500 max-w-md mx-auto flex flex-col gap-4">
              <h2 className="text-xl font-bold">Fast Delivery</h2>
              <p>
                At consectetur delectus ducimus est facere iure molestias obcaecati quaerat vitae voluptate? Aspernatur dolor explicabo iste minus molestiae pariatur provident quibusdam saepe?
              </p>
            </div>
            <div className="text-gray-500 max-w-md mx-auto flex flex-col gap-4">
              <h2 className="text-xl font-bold">Secure Payment</h2>
              <p>
                Laborum molestias neque nulla obcaecati odio quia quod reprehenderit sit vitae voluptates? Eos, tenetur.
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
