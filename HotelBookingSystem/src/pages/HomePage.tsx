import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import PopularHotels from "../components/PopularHotels";
import WhyChooseUs from "../components/WhyChooseUs";
import SummerOffer from "../components/SummerOffer";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function HomePage(){
  return(<div>
    <Header />
         <Hero />
         <PopularHotels />
         <WhyChooseUs />
         <SummerOffer />
         <Testimonials />
         <Footer />
  </div>)
}