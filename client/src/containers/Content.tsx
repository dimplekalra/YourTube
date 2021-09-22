import React, { Suspense } from "react";
import { IAcceptAll } from "../common/interfaces";

import MainRouter from "../routes/MainRouter";

const loading = <div className="pt-3 text-center">Loading...</div>;

const Content: React.FC<IAcceptAll> = () => {
  return (
    <main className="section">
      <Suspense fallback={loading}>
        <MainRouter />
      </Suspense>
    </main>
  );
};

export default Content;
