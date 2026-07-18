import sushi from '../assets/sushi.png'

function CookieIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="var(--color-cookie-honey)" />
      <circle cx="8" cy="9" r="1.4" fill="var(--color-cookie-brown)" />
      <circle cx="15.5" cy="7.5" r="1.1" fill="var(--color-cookie-brown)" />
      <circle cx="16" cy="14" r="1.4" fill="var(--color-cookie-brown)" />
      <circle cx="9.5" cy="15.5" r="1.1" fill="var(--color-cookie-brown)" />
      <circle cx="12.5" cy="11.5" r="1" fill="var(--color-cookie-brown)" />
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
          Since we&apos;re a team of two (a developer and a cat) and only one of us has a
          driver&apos;s license, distribution will be limited to Skopje for the time
          being. If you&apos;re interested, feel free to browse the options available in
          the Cookies page and get in touch with us so we can have them ready for you!
        </p>
      </div>

      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-10">
        <div className="relative w-64 flex-none sm:w-80">
          <img
            src={sushi}
            alt="Sushi, the Siamese cat behind codecatcookies"
            className="w-full"
          />
          <CookieIcon className="absolute -top-4 -right-3 h-10 w-10 rotate-6" />
          <CookieIcon className="absolute -bottom-3 -left-4 h-7 w-7 -rotate-12" />
          <CookieIcon className="absolute top-1/2 -left-6 h-5 w-5 rotate-3" />
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
