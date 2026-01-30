import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Officeworks | Home - Office & School Stationery",
  description: "Find all your day-to-day office and school stationery needs. 100% made in Sri Lanka. SETH own products. Quality photocopy papers, printer cartridges, office accessories.",
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
