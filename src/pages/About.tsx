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
          A small home kitchen, a very loud cat and sweet treats
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-cookie-brown">
          Why accept our cookies?
        </h2>
        <p className="text-cookie-charcoal">
          It&apos;s simple, glucose (sugar), is our primary source of energy and the brain
          is the most energy-demanding organ we have. As a programmer, turned home baker,
          I&apos;m fully aware how essential it is to have a sweet treat at hand. The
          solution is simple and it comes in many forms, chocolate chip, peanut butter and
          other delicious flavors to help you max out your problem solving skills.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-cookie-brown">
          How do you get a hold of our cookies?
        </h2>
        <p className="text-cookie-charcoal">
          As we&apos;re finding our footing, we&apos;re mainly providing our sugary
          services in Skopje. If you&apos;d like to get your hands on some of these
          delicious brain boosters, you can pick them up{' '}
          <a
            href="https://www.instagram.com/portalskopje/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            @Portal
          </a>{' '}
          in Karposh. Just place your order on the site and schedule a pickup time,
          payment is in cash.
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
          <h2 className="text-xl font-bold text-cookie-brown">
            What&apos;s with the cat?
          </h2>
          <p className="text-cookie-charcoal">
            Glad you asked, this little menace, government name Sushi is our mascot!
            She&apos;s the designated micromanager, making sure your order is made
            perfectly every single time. If you happen to have a complaint, you&apos;ll
            have to take it up with her (and she&apos;s quite scary).
          </p>
        </div>
      </div>
    </section>
  )
}

export default About
