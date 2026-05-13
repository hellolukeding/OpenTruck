const features = [
  {
    icon: "shuffle",
    title: "Load Balancing",
    desc: "Distributed traffic across global clusters to ensure 0% request drop.",
  },
  {
    icon: "speed",
    title: "Low Latency",
    desc: "Edge inference reduces round-trip times by up to 60%.",
  },
  {
    icon: "security",
    title: "Private Tunnel",
    desc: "End-to-end encryption for all model training and inference data.",
  },
  {
    icon: "payments",
    title: "Unified Billing",
    desc: "One invoice for all providers: OpenAI, Anthropic, Google, and more.",
  },
];

export function LandingFeatures() {
  return (
    <section className="bg-secondary-container/30 py-20">
      <div className="px-gutter max-w-container-max mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-white p-4 rounded-xl shadow-2xl border border-outline-variant/20 relative aspect-video flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-[48px] text-primary">hub</span>
                <p className="font-headline-md text-headline-md mt-4">Intelligent Routing</p>
                <p className="text-secondary text-body-sm mt-2">100+ edge locations worldwide</p>
              </div>
              <div className="absolute -bottom-6 -right-6 p-6 bg-primary text-white rounded-lg shadow-xl hidden md:block">
                <div className="font-headline-md text-headline-md font-bold">100+</div>
                <div className="font-label-md text-label-md opacity-80 uppercase tracking-wider">
                  Edge Locations
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="font-display text-display leading-tight">
              Advanced Intelligent <br />
              Routing Architecture
            </h2>
            <p className="text-body-lg text-secondary">
              Our middleware layer automatically determines the best performing node for
              your specific query location and model requirements.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((f) => (
                <div key={f.title} className="flex gap-4">
                  <span className="material-symbols-outlined text-primary bg-primary-container/10 p-2 rounded-lg h-fit">
                    {f.icon}
                  </span>
                  <div>
                    <h4 className="font-bold mb-1">{f.title}</h4>
                    <p className="text-body-sm text-secondary">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
