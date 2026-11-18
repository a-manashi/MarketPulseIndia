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
        A configurable market provider supplies the dashboard when data is
        authorized and available. News articles are simulated editorial
        examples. Links to original publisher coverage are planned once data
        access and display rights are verified.
      </p>
    </InformationPage>
  );
}
