import Header from "@/shared/components/header";
import Footer from "@/shared/components/footer";
import { DisableDraftMode } from "@/shared/components/disable-draft-mode";
import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";
import { SanityLive } from "@/shared/sanity/lib/live";
import { Suspense } from "react";
import PageTracker from "@/shared/components/PageTracker";
import GlobalContactModal from "@/shared/components/global-contact-modal";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <GlobalContactModal />
      <SanityLive />
      {(await draftMode()).isEnabled && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
      <Footer />
      <Suspense fallback={<div>Loading...</div>}>
        <PageTracker />
      </Suspense>
    </>
  );
}
