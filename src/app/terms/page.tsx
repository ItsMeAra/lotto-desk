import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Terms of Service | Rafflehaus",
  description: "Terms governing use of the Rafflehaus platform.",
};

const LAST_UPDATED = "April 8, 2026";

export default function TermsPage() {
  return (
    <div className="relative isolate z-0 flex min-h-0 flex-1 flex-col bg-cream">
      <SiteHeader />
      <main className="relative z-10 flex-1">
        <LegalDocument title="Terms of Service" lastUpdated={LAST_UPDATED}>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">1. Agreement to these terms</h2>
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the Rafflehaus website and related
            services (the &ldquo;Services&rdquo;). By creating an account, accessing, or using the Services, you agree to
            these Terms. If you do not agree, do not use the Services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">2. Description of the Services</h2>
          <p>
            Rafflehaus provides tools for organizers to configure lotteries or raffles, share public entry pages, collect
            submissions, help reduce duplicate entries, conduct draws, and export data. We do not guarantee any particular
            legal outcome, regulatory compliance, or fitness for a specific jurisdiction.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">3. Eligibility</h2>
          <p>
            You must be able to form a legally binding contract in your jurisdiction and meet any minimum age we specify. You
            represent that the information you provide is accurate. Organizers are solely responsible for ensuring their
            promotions comply with applicable laws (including gambling, sweepstakes, marketing, and consumer protection
            rules).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">4. Organizer accounts</h2>
          <p>
            You are responsible for safeguarding your account credentials and for all activity under your account. Notify us
            promptly of unauthorized use. We may suspend or terminate accounts that violate these Terms or pose a security
            risk.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">5. Public lotteries and entry data</h2>
          <p>
            When you run a lottery, entrants may submit personal information through forms hosted on the Services. You
            acknowledge that you are responsible for your own lawful bases, privacy notices, and rules shown to entrants, and
            for handling winner data in line with applicable law. Rafflehaus processes data as described in our Privacy Policy
            and any applicable data processing agreement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">6. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Violate any law or third-party rights;</li>
            <li>Upload malware, probe, or scan systems without authorization;</li>
            <li>Attempt to access other users&rsquo; data without permission;</li>
            <li>Use the Services to send spam, harass others, or run deceptive promotions;</li>
            <li>Reverse engineer or attempt to extract source code except where permitted by law; or</li>
            <li>Interfere with the integrity or performance of the Services.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">7. Intellectual property</h2>
          <p>
            The Services, including software, branding, and documentation, are owned by Rafflehaus or its licensors. Subject
            to these Terms, we grant you a limited, non-exclusive, non-transferable license to use the Services. You retain
            rights to content you upload; you grant us a license to host and process that content to operate the Services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">8. Disclaimers</h2>
          <p>
            THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE.&rdquo; TO THE MAXIMUM EXTENT PERMITTED BY
            LAW, WE DISCLAIM ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING MERCHANTABILITY, FITNESS FOR
            A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR
            ERROR-FREE.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">9. Limitation of liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, RAFFLEHAUS AND ITS SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL. OUR AGGREGATE
            LIABILITY FOR ALL CLAIMS RELATING TO THE SERVICES WILL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU PAID US FOR
            THE SERVICES IN THE TWELVE (12) MONTHS BEFORE THE EVENT GIVING RISE TO LIABILITY OR (B) ONE HUNDRED U.S. DOLLARS
            (US$100), EXCEPT WHERE PROHIBITED BY LAW. SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS; IN THOSE CASES OUR
            LIABILITY IS LIMITED TO THE FULLEST EXTENT PERMITTED.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">10. Indemnity</h2>
          <p>
            You will defend, indemnify, and hold harmless Rafflehaus and its affiliates from claims, damages, and expenses
            (including reasonable attorneys&rsquo; fees) arising from your use of the Services, your lotteries, your content,
            or your violation of these Terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">11. Termination</h2>
          <p>
            You may stop using the Services at any time. We may suspend or terminate access to the Services for breach of
            these Terms or for operational reasons. Provisions that by their nature should survive will survive termination.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">12. Governing law and disputes</h2>
          <p>
            <strong>Placeholder:</strong> These Terms are governed by the laws of California, excluding conflict-of-law
            rules. Courts in California will have exclusive jurisdiction, except where prohibited by law. Alternative dispute
            resolution (arbitration or class-action waiver) may be required in your jurisdiction—confirm with counsel.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">13. Changes</h2>
          <p>
            We may modify these Terms. We will post the updated Terms and update the &ldquo;Last updated&rdquo; date.
            Continued use after changes become effective constitutes acceptance, where permitted by law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">14. Contact</h2>
          <p>
            For questions about these Terms, contact us at the address or email published for Rafflehaus on this website
            (placeholder—replace with verified contact details).
          </p>
        </section>
      </LegalDocument>
      </main>
    </div>
  );
}
