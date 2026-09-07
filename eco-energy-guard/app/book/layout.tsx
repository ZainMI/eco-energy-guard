import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Free Home Energy Inspection",
  description:
    "Request a free home energy inspection with Eco Energy Guard in Central Connecticut.",
  alternates: { canonical: "/book" },
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
