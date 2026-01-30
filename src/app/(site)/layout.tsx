import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
import { Toaster } from "react-hot-toast";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <CartModalProvider>
        <ModalProvider>
          <PreviewSliderProvider>
            <a
              href="#main-content"
              className="absolute -left-[9999px] top-4 z-[100] px-4 py-2 bg-blue text-white rounded-md font-medium focus:left-4 focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2"
            >
              Skip to content
            </a>
            <Header />
            <div id="main-content" className="min-h-screen flex flex-col" tabIndex={-1}>
              {children}
            </div>
            <Footer />
            <Toaster />
            <QuickViewModal />
            <CartSidebarModal />
            <PreviewSliderModal />
            <ScrollToTop />
          </PreviewSliderProvider>
        </ModalProvider>
      </CartModalProvider>
    </ReduxProvider>
  );
}