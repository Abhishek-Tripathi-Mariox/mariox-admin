import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authRoutes, router } from "./routes";
import { store } from "./store";
import { PrivateRoute } from "./routes/privateRoute";
import BlankLayout from "./layouts/blankLayout";

function App() {
  return (
    <>
      <div className="App">
        <Provider store={store}>
          <ToastContainer autoClose={2000} theme="colored" />
          <BrowserRouter>
            <Routes>
              <Route element={<BlankLayout />}>
                {authRoutes.map((prop, i) => {
                  return (
                    <Route
                      key={i}
                      path={prop.path}
                      element={<prop.element />}
                    />
                  );
                })}
              </Route>

              <Route element={<PrivateRoute />}>
                {router.map((prop, index) => {
                  if (prop.child && prop.child.length > 0) {
                    return prop.child.map((data) => {
                      return (
                        <Route
                          key={data?.path}
                          path={data.path}
                          element={<data.element />}
                        />
                      );
                    });
                  } else {
                    return (
                      <Route
                        key={index}
                        path={prop.path}
                        element={<prop.element />}
                      />
                    );
                  }
                })}
              </Route>
              <Route path="*" element={<Navigate to="/auth/login" />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </div>
    </>
  );
}

export default App;
