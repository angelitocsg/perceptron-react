import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { DecouplerContext } from "./di/DecouplerContext";
import { ServiceLocator } from "./di/ServiceLocator";
import { ServiceName } from "./di/ServiceName";
import App from "./pages/App";
import reportWebVitals from "./reportWebVitals";
import { AutoTraining } from "./algorithms/AutoTraining";
import { Perceptron } from "./algorithms/Perceptron";
import { ScreenService } from "./services/ScreenService";
import { StateService } from "./services/StateService";

let locator = new ServiceLocator();
locator.register(ServiceName.AutoTrainService, AutoTraining);
locator.register(ServiceName.PerceptronService, Perceptron);
locator.register(ServiceName.ScreenService, ScreenService);
locator.register(ServiceName.StateService, StateService);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <DecouplerContext.Provider value={locator}>
      <App />
    </DecouplerContext.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
