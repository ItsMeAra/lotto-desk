import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Privacy Policy | Rafflehaus",
  description: "How Rafflehaus collects, uses, and protects personal information.",
};

const LAST_UPDATED = "April 8, 2026";

export default function PrivacyPage() {
  return (
    <div className="relative isolate z-0 flex min-h-0 flex-1 flex-col bg-cream">
      <SiteHeader />
      <main className="relative z-10 flex-1">
        <LegalDocument title="Privacy Policy" lastUpdated={LAST_UPDATED}>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">1. Introduction</h2>
          <p>
            Rafflehaus (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) provides software that helps organizers run
            lotteries and raffles and collect entries from the public. This Privacy Policy explains how we process personal
            information when you use our website and services (the &ldquo;Services&rdquo;).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">2. Who is responsible?</h2>
          <p>
            Depending on applicable law and your relationship with us, <strong>Rafflehaus</strong> may act as a{" "}
            <strong>controller</strong> of certain personal information (for example, organizer account data) and/or a{" "}
            <strong>processor</strong> on behalf of organizers who use the platform to run lotteries. Organizers who collect
            entrant data may also be independent controllers for that data. You should coordinate with counsel to document
            roles (including data processing agreements where required).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">3. Information we may collect</h2>
          <p>We may collect or process categories of information such as:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Organizer account data:</strong> for example, name, email address, authentication identifiers, and
              billing-related information if applicable.
            </li>
            <li>
              <strong>Entrant / participant data:</strong> information submitted on entry forms (for example, name, email,
              shipping address, country, and optional fields such as Instagram username or PayPal email when the organizer
              enables them).
            </li>
            <li>
              <strong>Technical and usage data:</strong> for example, IP address, device/browser type, approximate location
              derived from IP, timestamps, logs, and security signals (such as bot-mitigation tokens where enabled).
            </li>
            <li>
              <strong>Communications:</strong> messages you send to us (for example, support requests).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">4. How we use information</h2>
          <p>We may use personal information to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Provide, operate, secure, and improve the Services;</li>
            <li>Authenticate users, prevent fraud and abuse, and enforce our terms;</li>
            <li>Facilitate lottery operations initiated by organizers (including entry collection, deduplication, draws, and exports);</li>
            <li>Comply with legal obligations and respond to lawful requests;</li>
            <li>Send service-related notices (for example, security or policy updates); and</li>
            <li>Analyze usage in aggregated or de-identified form where appropriate.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">5. Legal bases (EEA/UK)</h2>
          <p>
            Where the GDPR or UK GDPR applies, we rely on one or more legal bases such as: performance of a contract,
            legitimate interests (balanced against your rights), consent where required, and legal obligation. The appropriate
            basis depends on the processing activity and should be confirmed with counsel.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">6. Sharing and subprocessors</h2>
          <p>
            We may share personal information with service providers that help us run the Services (for example, hosting,
            database, authentication, email delivery, security, and analytics). We may also disclose information if required by
            law, to protect rights and safety, or as part of a business transaction subject to applicable law.
          </p>
          <p>
            A current list of categories of subprocessors or named vendors should be maintained and linked here after review
            with counsel.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">7. International transfers</h2>
          <p>
            If personal information is transferred across borders (for example, from the EEA/UK to the United States or other
            countries), we use appropriate safeguards where required, such as Standard Contractual Clauses or other
            mechanisms recognized by applicable law. Details should be confirmed with counsel and your infrastructure
            providers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">8. Retention</h2>
          <p>
            We retain personal information only as long as needed for the purposes described in this policy, unless a longer
            period is required or permitted by law (for example, accounting or dispute resolution). Retention schedules for
            lottery and entry records should be aligned with organizer obligations and local regulations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">9. Security</h2>
          <p>
            We implement reasonable technical and organizational measures designed to protect personal information. No
            method of transmission or storage is completely secure; we cannot guarantee absolute security.
          </p>
        </section>

        <section id="cookies" className="scroll-mt-24 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">10. Cookies and similar technologies</h2>
          <p>
            Rafflehaus uses <strong>essential cookies</strong> (and similar storage) so you can stay signed in, maintain your
            session securely, and protect the service from abuse. We do not use advertising or third-party analytics cookies in
            the default configuration. If we add optional analytics (for example Plausible or similar) in the future, we will
            update this notice and, where required by law, only load those tools after appropriate consent or configuration.
          </p>
          <p>
            You can control cookies through your browser settings. Essential cookies may be required for account features to
            work.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">11. Your rights</h2>
          <p>
            Depending on your location, you may have rights to access, rectify, delete, restrict, or object to certain
            processing, and to data portability. You may also have the right to lodge a complaint with a supervisory
            authority. To exercise rights, contact us using the details below. We may need to verify your request.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">12. Children</h2>
          <p>
            The Services are not directed to children under the age required by applicable law. Organizers should not collect
            entries from individuals below the permitted age for their promotion.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">13. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will post the updated version and revise the &ldquo;Last
            updated&rdquo; date. Material changes may require additional notice under applicable law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">14. Contact</h2>
          <p>
            For privacy-related requests, contact us at the email address or postal address published for Rafflehaus on this
            website (placeholder—replace with verified contact details).
          </p>
        </section>
      </LegalDocument>
      </main>
    </div>
  );
}
