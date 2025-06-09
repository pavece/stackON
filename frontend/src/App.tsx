import { BrowserRouter, Route, Routes } from "react-router";
import { MainPage } from "./pages/main-page";
import { MainLayout } from "./layouts/main-layout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<MainPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
