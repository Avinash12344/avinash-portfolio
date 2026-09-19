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
import { getPortfolio, getWork } from "./lib/api";

export default async function Home() {
  let portfolio = null;
  let work = [];

  // allSettled so one failing endpoint doesn't blank the whole page
  const [portfolioResult, workResult] = await Promise.allSettled([
    getPortfolio(),
    getWork(),
  ]);

  if (portfolioResult.status === "fulfilled") {
    portfolio = portfolioResult.value?.data || null;
  } else {
    console.error("Failed to load portfolio:", portfolioResult.reason);
  }

  if (workResult.status === "fulfilled") {
    work = workResult.value?.data || [];
  } else {
    console.error("Failed to load work:", workResult.reason);
  }

  return (
    <>
      <Navbar />
      <Hero profile={portfolio?.profile} skills={portfolio?.skills} />
      <About profile={portfolio?.profile} services={portfolio?.services} />
      <Services services={portfolio?.services} />
      <Projects work={work} />
      <Skills skills={portfolio?.skills} />
      <Stats stats={portfolio?.stats} />
      <Reviews reviews={portfolio?.reviews} />
      <Contact />
      <Footer />
    </>
  );
}