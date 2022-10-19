import { useState } from "react";
import "./App.css";
import Nav from "./components/nav";
import Footer from "./components/footer";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/home";
import NotFound from "./pages/404";
import StudyTest from "./pages/study-test";
import CreateWordbook from "./pages/create-wordbook";
import { LogInPage } from "./pages/login-page";
import {SignUpPage} from "./pages/signup-page"
import MyWordbooks from "./pages/my-wordbooks"
import EditWordbook from "./pages/edit-wordbook";
import ViewWordbook from "./pages/view-wordbook";
import LearnWordbook from "./pages/learn-wordbook";


function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App flex flex-col min-h-screen">
     <ScrollToTop />
      <Router>
        <Nav />
        <div className="main flex-grow mx-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wordbook/new" element={<CreateWordbook />} />  
            <Route path="/wordbook/my" element={<MyWordbooks />} />   
            <Route path="/wordbook/:wordbook_id/edit" element={<EditWordbook />} />
            <Route path="/wordbook/:wordbook_id/view" element=
            {<ViewWordbook />} />
            <Route path="/wordbook/:wordbook_id/learn" element= {
              <LearnWordbook /> } />
            <Route path="/login" element={<LogInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/test" element={<StudyTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>

      <Footer />
    </div>
  );
}

export default App;
