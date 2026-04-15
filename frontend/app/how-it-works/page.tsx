import HowItWorks from "@/components/HowItWorks";
import FeatureGrid from "@/components/FeatureGrid";

export default function Page() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 pb-8 pt-20 text-center">
        <h1 className="text-5xl font-semibold tracking-tight">How Nailytics works</h1>
        <p className="mx-auto mt-4 max-w-2xl text-white/60">
          A standard credit card is exactly 85.60 × 53.98 mm — same size, anywhere
          in the world. We use it as a ruler.
        </p>
      </section>
      <HowItWorks />
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="glass p-8">
          <h2 className="text-2xl font-semibold">The science behind it</h2>
          <p className="mt-3 text-white/70">
            Once we find the four corners of your bank card in the photo, we
            compute a homography — a projective transform that maps every pixel
            to its real-world position in millimetres on the card&apos;s surface.
            The same transform is applied to the nail&apos;s bounding box,
            giving sub-millimetre accuracy that doesn&apos;t depend on camera
            angle or distance.
          </p>
          <p className="mt-3 text-white/70">
            The nail itself is found with a YOLO model trained on thousands of
            fingernail photos, so it works in any lighting and any pose.
          </p>
        </div>
      </section>
      <FeatureGrid />
    </>
  );
}
