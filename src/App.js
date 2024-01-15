import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppProvider from "./context";
import Home from "./pages/Home/Home";
import Navbar from "./Components/Navbar";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Upload from "./pages/Upload/Upload";
import Profile from "./pages/profile/Profile";
import Comments from "./pages/Comments/Comments";

function App() {
  return (
    <AppProvider>
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path="*" element={<Home></Home>}></Route>
          <Route path="/home" element={<Home></Home>}></Route>
          <Route path="/upload" element={<Upload></Upload>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          <Route path="/:image/:postId" element={<Comments></Comments>}></Route>
          <Route path="/:email" element={<Profile></Profile>}></Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
