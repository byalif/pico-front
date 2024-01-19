import { render, screen } from "@testing-library/react";
import {
  BrowserRouter,
  MemoryRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import AppProvider from "./context";
import Home from "./pages/Home/Home.js";
import Profile from "./pages/profile/Profile.js";
import Elipsis from "./pages/Home/Elipsis.js";
import Popup from "./pages/Comments/Popup.js";
import { post } from "./mockData/mockData.js";

describe("API unit tests", () => {
  // test("Fetch posts is working", async () => {
  //   render(
  //     <AppProvider>
  //       <BrowserRouter>
  //         <Home />
  //       </BrowserRouter>
  //     </AppProvider>
  //   );
  //   const posts = await screen.findAllByTestId("allPosts");
  //   expect(posts.length).toBeGreaterThan(0);
  // });
  test("Fetching profile is working", async () => {
    //Rendering component with a default author
    render(
      <AppProvider>
        <Router initialEntries={["/alifrahi22@gmail.com"]}>
          <Routes>
            <Route path="/:email" element={<Profile />} />
          </Routes>
        </Router>
      </AppProvider>
    );
    const defaultAuthor = await screen.findAllByText("A")[0];
    const author = await screen.findAllByTestId("author")[0];
    expect(defaultAuthor).toBe(author);
  });
});

describe("Component unit tests", () => {
  test("Elipsis componenet triggers", () => {
    render(
      <AppProvider>
        <Elipsis trigger={true} />
      </AppProvider>
    );
    const elements = screen.getAllByRole("heading", { level: 4 });
    expect(elements.length).toBe(2);
  });

  test("Popup componenet triggers", () => {
    render(
      <AppProvider>
        <BrowserRouter>
          <Popup trigger={true} posts={post} />
        </BrowserRouter>
      </AppProvider>
    );
    const likes = screen.getAllByTestId("allLikes");
    expect(likes.length).toBe(3);
  });
});
