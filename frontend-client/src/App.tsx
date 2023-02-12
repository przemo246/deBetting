import { Routes, Route } from "react-router-dom";

import { Layout } from "./features/layout/components/Layout";
import Mint from "pages/Mint";
import Matches from "pages/Matches";
import NotFound from "pages/NotFound";
import Bets from "pages/Bets";
import Dashboard from "pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="matches" element={<Matches />} />
        <Route path="bets" element={<Bets />} />
        <Route path="mint" element={<Mint />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
