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
        The current quotes, index values, charts and news examples are
        simulated. Where market data is introduced, it may be delayed or
        incomplete. Independently verify information with the relevant exchange
        or original publisher before making financial decisions.
      </p>
      <p>Investing involves risk, including loss of capital.</p>
    </InformationPage>
  );
}
