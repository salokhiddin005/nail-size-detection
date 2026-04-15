export default function Page() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-5xl font-semibold tracking-tight">About Nailytics</h1>
      <p className="mt-6 text-lg text-white/70">
        Nailytics started as a research project: how accurately can a smartphone
        camera measure something tiny, with no special hardware? The answer
        turned out to be — very accurately, as long as you have a known
        reference.
      </p>
      <p className="mt-4 text-lg text-white/70">
        We use a standard bank card as that reference. Every credit, debit, and
        ID card on the planet is the same size: 85.60 × 53.98 mm. By detecting
        the card in your photo and computing the perspective transform back to
        its true dimensions, we can measure anything else in the same plane to
        within a fraction of a millimetre.
      </p>
      <p className="mt-4 text-lg text-white/70">
        We&apos;re starting with fingernails — for press-on nails, manicure
        kits, and beauty-tech retail — but the same approach works for
        jewellery, dermatology, and anywhere people need a precise measurement
        without a ruler.
      </p>
    </section>
  );
}
