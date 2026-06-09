export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-cream-ivory pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <h1 className="text-h1 font-playfair font-bold text-heritage-navy mb-8">Disclaimer</h1>
        <div className="prose max-w-none text-hierarchy-1 space-y-6">
          <p className="text-body font-semibold">
            The information provided on this website is for educational purposes only and should not be construed as investment advice, financial advice, or a recommendation to buy or sell any security.
          </p>
          <h2 className="text-h2 font-playfair font-semibold text-heritage-navy mt-8">No Warranty</h2>
          <p className="text-body">
            The materials on this website are provided on an {`"as is"`} basis. Family Wealth Custodians makes no warranty, express or implied, with respect to the materials.
          </p>
          <h2 className="text-h2 font-playfair font-semibold text-heritage-navy mt-8">Limitations of Liability</h2>
          <p className="text-body">
            In no event shall Family Wealth Custodians be liable for any indirect, consequential, special, or incidental damages arising out of or related to this website.
          </p>
          <h2 className="text-h2 font-playfair font-semibold text-heritage-navy mt-8">Personal Investment Advice</h2>
          <p className="text-body">
            For personalized investment advice tailored to your specific situation, please schedule a consultation with one of our advisors.
          </p>
          <p className="text-caption text-hierarchy-2 mt-12">Last updated: June 2025</p>
        </div>
      </div>
    </div>
  );
}
