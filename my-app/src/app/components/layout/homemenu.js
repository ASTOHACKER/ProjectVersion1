import MenuItem from "../menu/Menuitem";
import SectionHeaders from "./Sectionheaders";

export default function HomeMenu() {
    return (
        <section className="p-4">
            {/* Heading Section */}
            <div className="text-center mb-8">
               <SectionHeaders 
                subHeader={'check out'}
                mainHeaders={'Meny'}/>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Menu Items */}
                <MenuItem />
                <MenuItem />
                <MenuItem />
                <MenuItem />
                <MenuItem />
            </div>
        </section>
    );
}