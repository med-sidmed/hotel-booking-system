
import Header from "../components/Header";
import Hero from "../components/Hero";
import PopularHotels from "../components/PopularHotels";
import WhyChooseUs from "../components/WhyChooseUs";
 import Testimonials, { SubmitReview } from "../components/Testimonials";
import Footer from "../components/Footer";

export default function HomePage(){
  return(<div>
    <Header />
         <Hero />
         <PopularHotels />
         <WhyChooseUs />
         <Testimonials />
          <div className="flex justify-center pb-8">
        <SubmitReview />
      </div>
         <Footer />
  </div>)
}