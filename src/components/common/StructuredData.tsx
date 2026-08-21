type StructuredDataProps = {
  name: string;
  description: string;
  url: string;
  category?: string;
};

function StructuredData({
  name,
  description,
  url,
  category = "Utility",
}: StructuredDataProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url,
    applicationCategory: category,
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(data)}
    </script>
  );
}

export default StructuredData;