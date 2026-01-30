
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import Image from "next/image";

const About = () => {
    return (
        <>
            <Breadcrumb title={"About Us"} pages={["about"]} />
            <section className="py-16 md:py-20 lg:py-24 bg-white relative z-1 overflow-hidden">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="flex flex-col lg:flex-row gap-10 items-center justify-between mb-20">
                        <div className="w-full lg:w-1/2">
                            <span className="text-blue font-bold tracking-widest uppercase mb-2 block text-sm">
                                SOME WORDS ABOUT US
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4 leading-tight">
                                We are more than <br /> A Stationery Store!
                            </h2>
                            <h3 className="text-xl font-medium text-dark-4 mb-6">
                                We love what we do
                            </h3>
                            <p className="text-body-color mb-9 text-lg leading-relaxed">
                                Office works is all kinds of office school and computer stationery importer and distributor.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex font-medium text-white bg-blue py-3.5 px-8 rounded-md ease-out duration-200 hover:bg-black shadow-btn hover:shadow-none"
                            >
                                Contact Us
                            </Link>
                        </div>
                        {/* Optional: Add an image here if the user provides one later */}
                        <div className="w-full lg:w-1/2 relative">
                            <Image
                                src="/images/about/about-hero.png"
                                alt="Office stationery store interior"
                                width={570}
                                height={400}
                                className="rounded-lg w-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="bg-[#F8F9FA] rounded-[10px] p-8 sm:p-12 lg:p-16">
                        <div className="max-w-[870px] mx-auto text-center mb-10">
                            <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-2">
                                OFFICE WORKS
                            </h2>
                            <h3 className="text-xl font-bold text-blue mb-6">About Us</h3>
                        </div>

                        <div className="max-w-[970px] mx-auto space-y-6 text-body-color text-base sm:text-lg leading-relaxed text-center sm:text-left">
                            <p>
                                Officeworks is more than a stationery store; we&apos;re Sri Lanka&apos;s
                                largest importer Manufacturers and direct supplier of quality
                                office and School stationery products for home offices, students
                                and small to large size businesses. We&apos;re part of the
                                Officeworks International, and also one of the largest buying
                                powers in Sri Lanka. We offer you more of the products and brands
                                you love, at the lowest prices.
                            </p>
                            <p>
                                Our ambition is to provide our customers with the widest range of
                                office and school stationery products at the lowest prices
                                everyday, backed with the best service. Our Team Members are the
                                heart and soul of our business.
                            </p>
                            <p>
                                Our team&apos;s guiding principles are integrity, respect, teamwork,
                                achievement and innovation. Our guiding principles are the keys to
                                our culture and to achieving our vision.
                            </p>
                            <p>
                                We value our Team Members&apos; contributions, recognize and reward
                                their efforts and provide a fun, satisfying and safe workplace.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default About;
