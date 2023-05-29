import "../../styles/styles.css";

// Component Import
import Header from "../components/Header";
import Weather from "../components/Weather.js";

function Home() {
  return (
    <>
      <Header />
      <Weather />
    </>
  );
}

export default Home;
