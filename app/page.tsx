import Banner from "@/components/Banner/banner";
import FeaturedDestinations from "@/components/Featured destinations/featuredDestinations";
import Navbar from "@/components/Navbar/navbar";


export default function Page() {
  return (
    <main className="relative">
      <Navbar />
      <Banner />
      <FeaturedDestinations />
    </main>
  )
}