import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "How Nailytics collects, uses, and protects your data.",
};

const lastUpdated = "April 22, 2026";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-16 text-white">
      <article className="mx-auto max-w-3xl">
        <header className="mb-10">
          <p className="text-sm text-white/50">
            Last updated: {lastUpdated}
          </p>
          <h1 className="mt-2 text-4xl font-semibold">Privacy Policy</h1>
          <p className="mt-4 text-white/70">
            This Privacy Policy describes how Nailytics (&ldquo;we&rdquo;,
            &ldquo;our&rdquo;, &ldquo;us&rdquo;) collects, uses, and protects
            information when you use our service.
          </p>
        </header>

        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              1. Information we collect
            </h2>
            <p>When you use Nailytics, we collect the following:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                <strong>Account information:</strong> full name, email address,
                and a password hash when you create an account.
              </li>
              <li>
                <strong>Uploaded images:</strong> photos you submit for nail
                size analysis. These are processed by our computer vision
                pipeline.
              </li>
              <li>
                <strong>Usage data:</strong> measurements produced by the
                analyzer, along with timestamps and general device/browser
                information used for diagnostics.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              2. How we use your information
            </h2>
            <ul className="list-disc space-y-1 pl-6">
              <li>To provide nail measurement results from images you upload.</li>
              <li>To authenticate you and keep your account secure.</li>
              <li>To improve accuracy and reliability of the service.</li>
              <li>To communicate with you about your account (e.g. password resets).</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              3. Third-party services
            </h2>
            <p>
              Nailytics relies on trusted infrastructure providers. Your data
              may be processed by them solely to deliver our service:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                <strong>Supabase</strong> &mdash; authentication and database
                storage.
              </li>
              <li>
                <strong>Vercel</strong> &mdash; web hosting and content delivery.
              </li>
            </ul>
            <p className="mt-2">
              We do not sell or rent your personal information to advertisers
              or data brokers.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              4. Data retention
            </h2>
            <p>
              Account information is retained while your account is active.
              Uploaded images and measurement results are retained so you can
              review them in your dashboard; you can delete them at any time.
              If you delete your account, associated data is removed within 30
              days, except where retention is required by law.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              5. Your rights
            </h2>
            <p>You have the right to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Access the information we hold about you.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>Export a copy of your data in a portable format.</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, contact us via the{" "}
              <Link href="/contact" className="underline underline-offset-4 hover:text-white">
                Contact
              </Link>{" "}
              page.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              6. Cookies and session storage
            </h2>
            <p>
              We use cookies and browser storage only to keep you signed in and
              to remember essential preferences. We do not use advertising or
              tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              7. Security
            </h2>
            <p>
              We take reasonable technical and organizational measures to
              protect your data, including encrypted connections (HTTPS),
              hashed passwords, and access controls. No system is perfectly
              secure; we ask that you use a strong, unique password.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              8. Children&apos;s privacy
            </h2>
            <p>
              Nailytics is not directed at children under 13. We do not
              knowingly collect information from children under 13. If you
              believe a child has provided us information, contact us and we
              will remove it.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              9. Changes to this policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. When we do,
              we will update the &ldquo;Last updated&rdquo; date at the top of
              the page. Significant changes will be communicated through the
              service or by email where appropriate.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">
              10. Contact
            </h2>
            <p>
              Questions about this Privacy Policy? Reach us via the{" "}
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
