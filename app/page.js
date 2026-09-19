import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Stats from "./components/Stats";
import Reviews from "./components/Reviews";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { getPortfolio } from "./lib/api";

export default async function Home() {
  let portfolio = null;

  try {
    const response = await getPortfolio();
    portfolio = response?.data || null;
  } catch (error) {
    console.error("Failed to load portfolio:", error);
  }

  return (
    <>
      <Navbar />

      <main>
        <Hero profile={portfolio?.profile} />
        <About profile={portfolio?.profile} />
        <Services services={portfolio?.services} />
        <Projects projects={portfolio?.projects} />
        <Reviews reviews={portfolio?.reviews} />
        <Contact />
        <Stats stats={portfolio?.stats} />
      </main>

      <Footer />
    </>
  );
}