import sushi from '../assets/sushi.png'
import { FramedSection } from '../components/CookieDecor'

function About() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-black text-cookie-brown uppercase sm:text-4xl">
          About us
        </h1>
        <p className="mt-3 text-lg text-cookie-brown/80">
          A small home kitchen, a very loud cat and sweet treats
        </p>
      </div>

      <FramedSection
        style={{ '--tilt': '-0.8deg' } as React.CSSProperties}
        className="sticker-card flex flex-col gap-4"
      >
        <h2 className="text-xl font-black text-cookie-brown uppercase">
          Why accept our cookies?
        </h2>
        <p className="text-cookie-charcoal">
          It&apos;s simple, we make great brain fuel. Ever sat down to debug something for 4
          hours straight just to realize that you&apos;ve been looking at dev instead of
          local environment? Yeah, have a cookie, we&apos;ve all been there. Even if
          you&apos;re not an engineer, you&apos;ll still highly benefit from this delicious
          goodness!
        </p>
      </FramedSection>

      <FramedSection
        style={{ '--tilt': '0.8deg' } as React.CSSProperties}
        className="sticker-card flex flex-col gap-4"
      >
        <h2 className="text-xl font-black text-cookie-brown uppercase">
          How do you get a hold of our cookies?
        </h2>
        <p className="text-cookie-charcoal">
          Cookies will be available for pickup, delivery or you just might find them at a
          coffee shop near you. Stay tuned to find out where to find us!
        </p>
      </FramedSection>

      <FramedSection
        style={{ '--tilt': '-0.5deg' } as React.CSSProperties}
        className="sticker-card flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-10"
      >
        <div className="w-64 flex-none sm:w-80">
          <img
            src={sushi}
            alt="Sushi, the Siamese cat behind codecatcookies"
            className="w-full rounded-2xl"
          />
        </div>
        <div className="flex flex-col gap-4 pt-4 sm:pt-8">
          <h2 className="text-xl font-black text-cookie-brown uppercase">
            What&apos;s with the cat?
          </h2>
          <p className="text-cookie-charcoal">
            Glad you asked, this little menace, government name Sushi is our mascot!
            She&apos;s the designated micromanager, making sure your order is made
            perfectly every single time. If you happen to have a complaint, you&apos;ll
            have to take it up with her (and she&apos;s quite scary).
          </p>
        </div>
      </FramedSection>
    </section>
  )
}

export default About
