import { RsvpForm } from "@/components/RsvpForm";
import { OpenInMapsLink } from "@/components/OpenInMapsLink";
import { PhotoGallery } from "@/components/PhotoGallery";
import Image from "next/image";

export default function Home() {
  const heroPhoto1 = "/photos/hero-1.jpg";
  const heroPhoto = heroPhoto1;

  const galleryPhotos = Array.from({ length: 14 }, (_, i) => {
    const number = i + 1;
    return {
      src: `/photos/${number}.jpeg`,
      alt: `Ashley and Brandon photo ${number}`,
    };
  });

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-semibold tracking-tight text-white">
                Ashley &amp; Brandon
              </p>
              <p className="text-xs text-white/60">Reception RSVP</p>
            </div>
          </div>

          <a
            href="#rsvp"
            className="inline-flex h-10 items-center rounded-xl bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-white/90"
          >
            RSVP
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroPhoto}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/55 to-slate-950" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pb-14 pt-12 sm:pb-20 sm:pt-16">
          <div className="max-w-3xl">
            <p className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-medium tracking-wide text-white/80">
              Saturday, September 26, 2026 • 3–8 PM
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Join us for a send‑off reception in Buffalo
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
              We&apos;ll be eloping in Ireland shortly after — the ceremony
              itself will be just the two of us. This reception is our chance to
              celebrate with family and friends!
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#rsvp"
                className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-white/90"
              >
                RSVP now
              </a>
              <OpenInMapsLink
                address="Tewksbury Lodge 249 Ohio St, Buffalo, NY 14204"
                className="inline-flex h-11 items-center rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white/95 transition hover:border-white/25 hover:bg-white/10"
              >
                Open in Maps
              </OpenInMapsLink>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-sm font-semibold text-white">Where</p>
                <p className="mt-2 text-white/85">
                  Tewksbury Lodge
                  <br />
                  249 Ohio St
                  <br />
                  Buffalo, NY 14204
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-sm font-semibold text-white">When</p>
                <p className="mt-2 text-white/85">
                  Saturday, September 26, 2026
                  <br />
                  3:00 PM – 8:00 PM
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-sm font-semibold text-white">Dress</p>
                <p className="mt-2 text-white/85">
                  Come as you are —
                  <br />
                  celebration‑ready.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm font-semibold text-white">Adults Only</p>
              <p className="mt-2 text-white/85">
                We love your little ones, but this will be an adults-only
                celebration. Thank you for understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            A few details
          </h2>
          <p className="mt-3 max-w-2xl text-white/70">
            We&apos;ll have food, drinks, music, and plenty of time to hang out!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:items-start">
          <div className="min-w-0 max-h-[742px] overflow-scroll rounded-2xl border border-white/10 bg-white/5 p-4">
            <PhotoGallery
              photos={galleryPhotos}
              variant="grid"
              showHint={false}
            />
          </div>

          <div id="rsvp" className="min-w-0 scroll-mt-24">
            <RsvpForm />
            <p className="mt-4 text-xs text-white/55">
              Your RSVP is saved privately to our database.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>Thanks for celebrating with us!</p>
          <p>Ashley &amp; Brandon</p>
        </div>
      </footer>
    </main>
  );
}
