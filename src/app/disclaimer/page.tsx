import type { Metadata } from "next";
import { InformationPage } from "@/components/layout/information-page";

export const metadata: Metadata = { title: "Financial disclaimer" };

export default function DisclaimerPage() {
  return (
    <InformationPage title="Financial disclaimer">
      <p className="font-medium text-market-warning">
        Preliminary wording. Review is required before production deployment.
      </p>
      <p>
        This website is intended for informational and educational purposes. Its
        content does not constitute investment advice.
      </p>
      <p>
        Market information from a configured provider may be delayed,
        unavailable or end-of-day depending on the exchange and instrument.
        Verify prices with your broker or an authorized market-data provider
        before making financial decisions. News articles are simulated during
        development.
      </p>
      <p>Investing involves risk, including loss of capital.</p>
    </InformationPage>
  );
}
