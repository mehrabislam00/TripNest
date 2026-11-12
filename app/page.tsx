import Banner from "@/components/Banner/banner";
import CTA from "@/components/CTA/cta";
import FeaturedDestinations from "@/components/Featured destinations/featuredDestinations";
import Navbar from "@/components/Navbar/navbar";
import Testimonials from "@/components/Testimonials/Testimonials";
import WhyChoose from "@/components/Whychoose/Whychoose";


export default function Page() {
  return (
    <main className="relative">
      <Navbar />
      <Banner />
      <FeaturedDestinations />
      <WhyChoose />
      <Testimonials />
      <CTA />
    </main>
  )
}