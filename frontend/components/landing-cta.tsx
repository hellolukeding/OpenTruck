export function LandingCta() {
  return (
    <section className="px-gutter max-w-container-max mx-auto mt-20 mb-20">
      <div className="bg-primary p-12 rounded-[2rem] text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
        <h2 className="font-display text-display mb-4">Ready to optimize your AI stack?</h2>
        <p className="text-body-lg opacity-80 mb-8 max-w-xl mx-auto">
          Join 50,000+ developers leveraging OpenTruck for production-grade AI applications.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-10 py-4 bg-white text-primary font-bold rounded-full hover:shadow-2xl transition-all">
            Create Free Account
          </button>
          <button className="px-10 py-4 border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all">
            Talk to Sales
          </button>
        </div>
      </div>
    </section>
  );
}
