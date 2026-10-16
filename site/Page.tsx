import SplashLoader from "./components/SplashLoader";
import StallNav from "./components/StallNav";
import BottleWallHero from "./components/BottleWallHero";
import PressMarquee from "./components/PressMarquee";
import PourEdge from "./components/PourEdge";
import FlavourStage from "./components/FlavourStage";
import MixCrate from "./components/MixCrate";
import ProductWheel from "./components/ProductWheel";
import FarmLedger from "./components/FarmLedger";
import CartonBars from "./components/CartonBars";
import CleansePlans from "./components/CleansePlans";
import FridgeNotes from "./components/FridgeNotes";
import StallFooter from "./components/StallFooter";
import OrangeTraveller from "./components/OrangeTraveller";

/** Pure Juice · "Studio Press": warm white, ink and one orange, with full-colour flavour bands. */
export default function Page() {
  return (
    <>
      <SplashLoader />
      <StallNav />
      <main className="pf-page">
        <BottleWallHero />
        <PressMarquee />
        <ProductWheel />
        <FarmLedger />
        <PourEdge color="#161616" />
        <CartonBars />
        <PourEdge color="var(--pf-band, #E9741C)" />
        <FlavourStage />
        <MixCrate />
        <CleansePlans />
        <FridgeNotes />
      </main>
      <StallFooter />
      <OrangeTraveller />
    </>
  );
}
