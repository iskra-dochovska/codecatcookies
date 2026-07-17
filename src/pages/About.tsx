import sushi from '../assets/sushi.png'

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0c.8 4.6 2.4 7.6 5 9.5 2 1.4 4.5 2 7 2.5-2.5.5-5 1.1-7 2.5-2.6 1.9-4.2 4.9-5 9.5-.8-4.6-2.4-7.6-5-9.5-2-1.4-4.5-2-7-2.5 2.5-.5 5-1.1 7-2.5 2.6-1.9 4.2-4.9 5-9.5z" />
    </svg>
  )
}

function About() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-cookie-brown sm:text-4xl">
          About us
        </h1>
        <p className="mt-3 text-lg text-cookie-brown/80">
          A small home kitchen, one cat, and too many cookie puns.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-cookie-brown">
          A small home kitchen
        </h2>
        <p className="text-cookie-charcoal">
          codecatcookies isn&apos;t a factory or a franchise — it&apos;s a home kitchen making
          small batches of cookies, one tray at a time. No shortcuts, no mass production,
          just cookies made carefully in small enough batches that every one gets checked
          before it goes out.
        </p>
      </div>

      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-10">
        <div className="relative w-64 flex-none sm:w-80">
          <img
            src={sushi}
            alt="Sushi, the Siamese cat behind codecatcookies"
            className="w-full"
          />
          <Sparkle className="absolute -top-4 -right-3 h-9 w-9 text-cookie-honey" />
          <Sparkle className="absolute -bottom-3 -left-4 h-6 w-6 rotate-12 text-cookie-rust" />
          <Sparkle className="absolute top-1/2 -left-2 h-4 w-4 text-cookie-gold" />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-cookie-brown">Meet Sushi</h2>
          <p className="text-cookie-charcoal">
            codecatcookies is named after — and inspired by — Sushi, a Siamese cat who
            supervises every single batch. She was there for the very first tray, and
            she hasn&apos;t missed one since. Consider her the brand&apos;s first and
            harshest quality control.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-cookie-brown">
          Baked by a developer
        </h2>
        <p className="text-cookie-charcoal">
          This whole thing is a programmer&apos;s side project: someone who writes code
          during the day and bakes cookies to unwind. The name is the pun you think it
          is — the only cookies you should ever have to accept are the kind you can eat,
          not the kind a website asks you to consent to.
        </p>
      </div>
    </section>
  )
}

export default About
