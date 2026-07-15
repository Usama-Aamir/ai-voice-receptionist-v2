export function About() {
  return (
    <section className="border-t border-border bg-bg px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
          About
        </p>
        <h2 className="mt-4 max-w-3xl text-2xl font-semibold tracking-tight text-text-primary md:text-3xl">
          Built by AISS AI Software Solutions Sdn. Bhd.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-text-secondary md:text-base md:leading-7">
          Solmy is developed by a registered Malaysian software company focused
          on practical AI tools for local small and medium businesses. We
          build systems that fit the way Malaysian companies actually operate —
          simple to set up, multilingual by default, and fully under your
          control.
        </p>

        <div className="mt-10 grid gap-6 text-sm text-text-secondary md:grid-cols-2">
          <div className="space-y-3">
            <p>
              <span className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
                Company
              </span>
              <br />
              AISS AI Software Solutions Sdn. Bhd.
            </p>
            <p>
              <span className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
                Registration No
              </span>
              <br />
              <span className="font-mono">972797-X</span>
            </p>
            <p>
              <span className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
                CEO
              </span>
              <br />
              Mr. Seelaan Thenrangan
            </p>
          </div>
          <div className="space-y-3">
            <p>
              <span className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
                Address
              </span>
              <br />
              Unit C-6-25, Centum @ Oasis Corporate Park,
              <br />
              No. 2 Jalan PJU 1A/2, Ara Damansara,
              <br />
              47301 Petaling Jaya, Selangor
            </p>
            <p>
              <span className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
                Contact
              </span>
              <br />
              <a
                href="mailto:info@aiss.my"
                className="transition-colors hover:text-text-primary"
              >
                info@aiss.my
              </a>
              <br />
              +60162104126
              <br />
              <a
                href="https://www.aisoftwaresolutions.com.my"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-text-primary"
              >
                www.aisoftwaresolutions.com.my
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
