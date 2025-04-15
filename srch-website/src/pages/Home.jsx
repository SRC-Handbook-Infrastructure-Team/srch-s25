import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Home component redirects to About page
function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to About page on component mount
    navigate("/about");
  }, [navigate]);

  // Return null while redirecting
  return null;
}

export default Home;
