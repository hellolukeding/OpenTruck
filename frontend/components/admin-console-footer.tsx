export function AdminConsoleFooter() {
  return (
    <footer className="border-t border-outline-variant/20 bg-surface-container-lowest">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-6 py-10 text-[0.92rem] text-on-surface-variant md:grid-cols-3">
        <div>
          <p className="text-[1.5rem] font-semibold tracking-[-0.05em] text-on-surface">OpenTruck</p>
          <p className="mt-3 text-[0.84rem]">
            © 2024 OpenTruck. High-performance AI infrastructure.
          </p>
        </div>
        <div>
          <p className="font-semibold text-on-surface">Resources</p>
          <div className="mt-3 space-y-2">
            <p>Documentation</p>
            <p>Changelog</p>
            <p>Status</p>
          </div>
        </div>
        <div>
          <p className="font-semibold text-on-surface">Company</p>
          <div className="mt-3 space-y-2">
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
            <p>Community</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
