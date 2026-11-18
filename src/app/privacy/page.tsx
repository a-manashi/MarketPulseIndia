import type { Metadata } from "next";
import { InformationPage } from "@/components/layout/information-page";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <InformationPage title="Privacy">
      <p className="font-medium text-market-warning">
        Preliminary wording. Review is required before production deployment.
      </p>
      <p>
        The app stores your color theme preference in this browser’s local
        storage. You can clear it by removing this site’s browser data.
      </p>
      <p>
        The public dashboard has no external market-data feed. Local research
        tooling, when separately authorized, may contact the configured
        market-data provider.
      </p>
      <p>
        This app has no user accounts or first-party analytics or advertising. A
        hosting provider may process technical request information under its own
        policies.
      </p>
    </InformationPage>
  );
}
