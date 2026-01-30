import About from "@/components/About";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | Office Works",
    description: "Learn more about Office Works, Sri Lanka's largest importer and distributor of office and school stationery.",
};

const AboutPage = () => {
    return (
        <main>
            <About />
        </main>
    );
};

export default AboutPage;
