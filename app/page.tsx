import Banner from "@/components/Banner/banner";
import CTA from "@/components/CTA/cta";
import FeaturedDestinations from "@/components/Featured destinations/featuredDestinations";
import Navbar from "@/components/Navbar/navbar";
import Testimonials from "@/components/Testimonials/Testimonials";
import WhyChoose from "@/components/Whychoose/Whychoose";
import Footer from "@/components/Footer/Footer";
import { getDestinations } from "@/lib/destinations";


export default async function Page() {
  const { destinations } = await getDestinations()

  return (
    <main className="relative">
     
      <Banner />
      <FeaturedDestinations destinations={destinations.slice(0, 8)} />
      <WhyChoose />
      <Testimonials />
      <CTA />
    
    </main>
  )
}