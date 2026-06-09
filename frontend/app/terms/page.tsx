export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream-ivory pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <h1 className="text-h1 font-playfair font-bold text-heritage-navy mb-8">Terms of Service</h1>
        <div className="prose max-w-none text-hierarchy-1 space-y-6">
          <p className="text-body">
            These Terms of Service govern your access to and use of the Family Wealth Custodians website and services.
          </p>
          <h2 className="text-h2 font-playfair font-semibold text-heritage-navy mt-8">Acceptance of Terms</h2>
          <p className="text-body">By accessing this website, you agree to be bound by these terms and conditions.</p>
          <h2 className="text-h2 font-playfair font-semibold text-heritage-navy mt-8">Use License</h2>
          <p className="text-body">Permission is granted to temporarily download material from this site for personal, non-commercial viewing only.</p>
          <h2 className="text-h2 font-playfair font-semibold text-heritage-navy mt-8">Disclaimer</h2>
          <p className="text-body">
            {`The materials on Family Wealth Custodians' website are provided for general information purposes and do not constitute investment advice.`}
          </p>
          <p className="text-caption text-hierarchy-2 mt-12">Last updated: June 2025</p>
        </div>
      </div>
    </div>
  );
}
