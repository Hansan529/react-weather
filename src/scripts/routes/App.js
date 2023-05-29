import Home from "../view/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "../../styles/styles.css";
// import styles from "./App.module.css";

// ! App.js - 라우터
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
