import type { Metadata } from "next";
import { InformationPage } from "@/components/layout/information-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <InformationPage title={`About ${siteConfig.name}`}>
      <p>
        {siteConfig.name} is an Indian financial news and market information
        project. Its dashboard brings benchmark indices, sector coverage and a
        sample stock watchlist into one view.
      </p>
      <p>
        The current development version uses simulated quotes and editorial
        examples. The roadmap includes market widgets and links to original
        publisher coverage once data access and display rights are verified.
      </p>
    </InformationPage>
  );
}
