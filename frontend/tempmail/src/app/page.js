'use client'
import Header from "@/components/header";
import MailBox from "@/components/mailBox"

import { useState } from "react";


export default function Home() {
  const [activeEmail, setActiveEmail] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <main>
      <Header
        onEmailChange={(newEmail) => setActiveEmail(newEmail)}
        onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
      />
      <MailBox activeEmail={activeEmail} refreshTrigger={refreshTrigger} />
    </main>
  );
}