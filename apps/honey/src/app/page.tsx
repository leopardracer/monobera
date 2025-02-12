"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { cloudinaryUrl } from "@bera/config";
import { cn } from "@bera/ui";

import Data from "~/components/data";
import { HoneyChart } from "~/components/honey-chart";
import HoneyPage from "~/components/honey-page";
import HoneyTransactionsTable from "~/components/honey-transactions-table";
import { LoadingBee } from "~/components/loadingBee";
import ModeSwitch from "~/components/mode-switch";

export default function Page() {
  return (
    <Suspense fallback={<LoadingBee />}>
      <Content />
    </Suspense>
  );
}

const Content = () => {
  const [arcade, setArcade] = useState<boolean>(false);
  const searchParams = useSearchParams();
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "arcade") setArcade(true);
    else setArcade(false);
  }, [searchParams]);
  return (
    <div
      className={cn(
        arcade ? "bg-backgroundSecondary font-honey" : "pro-mode-background",
      )}
    >
      <ModeSwitch arcade={arcade} />
      <HoneyPage arcade={arcade} />
      <div
        className={cn(
          arcade
            ? "bg-gradient-to-b from-backgroundSecondary text-foregroundSecondary xl:to-background"
            : "",
        )}
      >
        <div className="container max-w-[1200px]">
          <Data arcade={arcade} />
          <div className="py-4">
            {arcade ? (
              <h3 className="mb-4 flex items-center gap-3 text-lg text-foregroundSecondary md:text-3xl">
                <Image
                  src={`${cloudinaryUrl}/honey/qqyo5g3phzdwezvazsih`}
                  className="w-8"
                  alt="honey"
                  width={32}
                  height={32}
                />
                Total Honey Supply & Volume
              </h3>
            ) : (
              <h3 className="mb-12 flex items-center justify-center gap-2 text-3xl font-bold md:text-5xl">
                <Image
                  src={`${cloudinaryUrl}/honey/gugztuverdsqvzw5co8a`}
                  className="w-12"
                  alt="honey"
                  width={48}
                  height={48}
                />
                Honey Stats
              </h3>
            )}
            <HoneyChart arcade={arcade} />
          </div>
          <HoneyTransactionsTable arcade={arcade} />
        </div>
      </div>
    </div>
  );
};
