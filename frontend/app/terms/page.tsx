import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description: "Rules and terms for using Nailytics.",
};

const lastUpdated = "April 22, 2026";

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-16 text-white">
      <article className="mx-auto max-w-3xl">
        <header className="mb-10">
          <p className="text-sm text-white/50">
            Last updated: {lastUpdated}
          </p>
          <h1 className="mt-2 text-4xl font-semibold">Terms of Service</h1>
          <p className="mt-4 text-white/70">
            By using Nailytics, you agree to these Terms of Service. Please
            read them carefully.
          </p>
        </header>

        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              1. The service
            </h2>
            <p>
              Nailytics is an AI-powered tool that estimates nail size and
              dimensions from photos you upload. Measurements are produced by
              computer vision models and are provided as estimates, not
              medical or professional advice.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              2. Eligibility and accounts
            </h2>
            <ul className="list-disc space-y-1 pl-6">
              <li>You must be at least 13 years old to use Nailytics.</li>
              <li>
                You are responsible for keeping your password confidential and
                for all activity under your account.
              </li>
              <li>
                You agree to provide accurate information when creating an
                account and to keep it up to date.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              3. Acceptable use
            </h2>
            <p>You agree not to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Upload unlawful, harmful, or infringing content.</li>
              <li>
                Attempt to disrupt or reverse-engineer the service, or bypass
                security controls.
              </li>
              <li>
                Use automated scripts to create accounts, scrape data, or
                submit requests at abusive volumes.
              </li>
              <li>
                Impersonate another person or misrepresent your affiliation.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              4. Your content
            </h2>
            <p>
              You retain ownership of the images and information you upload
              (&ldquo;your content&rdquo;). By uploading, you grant Nailytics a
              limited, non-exclusive license to store and process your content
              solely to provide the service to you, including running
              measurement analysis and displaying results on your dashboard.
            </p>
            <p className="mt-2">
              You are responsible for ensuring you have the right to upload
              any images you submit.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              5. Accuracy disclaimer
            </h2>
            <p>
              Measurements produced by Nailytics are estimates based on image
              input and reference calibration. Real-world conditions (image
              quality, lighting, calibration card placement, and model
              limitations) affect accuracy. Do not rely on Nailytics results
              for medical, safety-critical, or legal decisions.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              6. No warranty
            </h2>
            <p>
              The service is provided &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; without warranties of any kind, express or
              implied, including warranties of merchantability, fitness for a
              particular purpose, or non-infringement.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              7. Limitation of liability
            </h2>
            <p>
              To the maximum extent permitted by law, Nailytics and its
              operators shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising from your
              use of the service. Our total liability for any claim will not
              exceed the amount you paid us, if any, in the 12 months before
              the claim.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              8. Termination
            </h2>
            <p>
              You may stop using Nailytics and delete your account at any
              time. We may suspend or terminate your access if you violate
              these Terms or misuse the service. Upon termination, your right
              to use the service immediately ends.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              9. Changes to the service and these terms
            </h2>
            <p>
              We may modify or discontinue features at any time. We may also
              update these Terms; when we do, we will update the &ldquo;Last
              updated&rdquo; date. Continued use after changes means you
              accept the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              10. Contact
            </h2>
            <p>
              Questions about these Terms? Reach us via the{" "}
              <Link href="/contact" className="underline underline-offset-4 hover:text-white">
                Contact
              </Link>{" "}
              page.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
