import { Helmet } from "react-helmet-async";

type SEOProps = {
  title: string;
  description: string;
  canonical?: string;
};

function SEO({
  title,
  description,
  canonical,
}: SEOProps) {
  const siteName =
    "My Toolkit";

  const fullTitle =
    title === siteName
      ? siteName
      : `${title} | ${siteName}`;

  const canonicalUrl =
    canonical ||
    `https://mytoolkit.com${window.location.pathname}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>

      <meta
        name="description"
        content={description}
      />

      <meta
        name="robots"
        content="index, follow"
      />

      <meta
        name="google-site-verification"
        content="ARGQZG8E2MbP_zOg69Zd3PFQ4Tb4qwb9GQ0D3eu9iWQ"
      />

      <link
        rel="canonical"
        href={canonicalUrl}
      />

      {/* Open Graph */}

      <meta
        property="og:title"
        content={fullTitle}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      <meta
        property="og:site_name"
        content={siteName}
      />

      {/* Twitter */}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={fullTitle}
      />

      <meta
        name="twitter:description"
        content={description}
      />
    </Helmet>
  );
}

export default SEO;