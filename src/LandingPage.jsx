export default function LandingPage() {
  const BOOKING_URL =
    "https://embed.evertransit.com/schedule.html?theme=default&api_key=1bfea3c4963ae25000e9469cf2dfa04bb1c6832db2cca0aa760089e3704201d034";
  const PHONE_DISPLAY = "401-231-2228";
  const PHONE_TEL = "14012312228";
  const EMAIL = "info@corporateri.com";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white grid place-items-center font-bold">
              CT
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Corporate Transportation
              </h1>
              <p className="text-xs text-slate-500">
                Scheduled rides • Rhode Island &amp; Massachusetts
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${PHONE_TEL}`}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 transition"
              aria-label={`Call dispatch at ${PHONE_DISPLAY}`}
            >
              Call {PHONE_DISPLAY}
            </a>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              Book a Ride
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16 grid md:grid-cols-2 items-center gap-10">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Reliable, professional{" "}
            <span className="whitespace-nowrap">scheduled transportation</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Medical appointments, airport transfers, and corporate travel —{" "}
            <span className="font-medium">by appointment only</span>. Serving
            Rhode Island and Massachusetts 24/7.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              Book a Ride
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="px-5 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 transition"
            >
              Call Dispatch
            </a>
          </div>
        </div>

        {/* EverTransit embed */}
        <div className="bg-white p-3 md:p-4 rounded-2xl shadow-xl ring-1 ring-slate-200">
          <iframe
            src={BOOKING_URL}
            title="Corporate Transportation — Schedule a Ride"
            className="w-full h-[640px] md:h-[720px] rounded-xl border border-slate-200"
            allow="geolocation *; clipboard-write; fullscreen"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <p className="mt-2 text-center text-slate-500 text-sm">
            If the scheduler doesn’t load,&nbsp;
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 underline"
            >
              open the booking page in a new tab
            </a>.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 text-white py-8">
        <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} Corporate Transportation</div>
          <div className="flex gap-4 text-sm">
            <a href={`tel:${PHONE_TEL}`} className="hover:text-slate-300">
              Call
            </a>
            <a href={`mailto:${EMAIL}`} className="hover:text-slate-300">
              Email
            </a>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300"
            >
              Book Online
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
