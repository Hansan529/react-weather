import "../../styles/styles.css";

// Component Import
import Header from "../components/Header";
import Weather from "../components/Weather.js";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Header />
      <Weather />
      <Footer />
    </>
  );
}

export default Home;
