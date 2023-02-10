import "./App.css";
import Notes from "./components/Notes";

import { ToastContainer } from "react-toastify";
// react-toastify css
import "react-toastify/dist/ReactToastify.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        notes: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache,
});

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <div className="container">
            <Routes>
              <Route path="/" element={<Notes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
        <ToastContainer />
      </ApolloProvider>
    </>
  );
}

export default App;
