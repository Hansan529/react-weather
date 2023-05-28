import Detail from "./components/Detail";
import Home from "./routes/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/styles.css";
// import styles from "./App.module.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/movie/:id",
    element: <Detail />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
