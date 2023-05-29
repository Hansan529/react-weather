// import styles from "../styles/routes/Home.module.css";

// Component Import
import Header from "../components/Header";
import Weather from "../components/Weather.js";

function Home() {
  return (
    <>
      <div id="container">
        <Header />
        <Weather />
      </div>
    </>
  );
}

export default Home;
