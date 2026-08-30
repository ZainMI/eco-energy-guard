import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/insulations",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/energy-inspection-canton",
        destination: "/locations/canton",
        permanent: true,
      },
      {
        source: "/energy-inspection",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/reflective-insulation",
        destination: "/services/radiant-barrier-foil",
        permanent: true,
      },
      {
        source: "/reflective-insulation-avon",
        destination: "/locations/avon",
        permanent: true,
      },
      {
        source: "/thermal-imaging",
        destination: "/services/thermal-imaging",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
