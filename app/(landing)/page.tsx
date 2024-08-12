import { LandingNavbar } from "@/components/landing-navbar";
import { LandingHero } from "@/components/landing-hero";
import { LandingVideo } from "@/components/landing-video";
import { LandingContent } from "@/components/landing-content";
import { LandingFeature } from "@/components/landing-feature"; // Import the new component
import { LandingFeature2 } from "@/components/landing-feature2";
import { LandingFeature3 } from "@/components/landing-feature3";
import { LandingFeature4} from "@/components/landing-feature4";

const LandingPage = () => {
  return ( 
    <div className="h-full ">
      <LandingNavbar />
      <LandingHero />
      <LandingVideo />
      <LandingFeature />
      <LandingFeature2/>
      <LandingFeature3/>
      <LandingFeature4/>
      <LandingContent />
    </div>
   );
}
 
export default LandingPage;
