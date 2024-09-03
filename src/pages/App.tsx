import "./App.css";

import { useService } from "../di/DecouplerContext";
import { ServiceName } from "../di/ServiceName";
import { AutoTraining } from "../algorithms/AutoTraining";
import { Perceptron } from "../algorithms/Perceptron";
import { ScreenService } from "../services/ScreenService";
import { StateService } from "../services/StateService";
import CodigoPesos from "./containers/CodigoPesos";
import Treinameto from "./containers/Treinamento";
import Validacao from "./containers/Validacao";

function App() {
  const screenService = useService<ScreenService>(ServiceName.ScreenService);
  const stateService = useService<StateService>(ServiceName.StateService);
  const perceptron = useService<Perceptron>(ServiceName.PerceptronService);

  function handlePredizer() {
    screenService.setLoading(true);
    setTimeout(() => {
      screenService.setLoading(false);
    }, 200);
    perceptron.predizer(AutoTraining.getBoolAsNumber(stateService.codigo));
  }

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column align-items-center">
        <h1 className="mt-4">ALGORITMO PERCEPTRON</h1>
        <CodigoPesos />
        <div className="row">
          <div className="col">
            <Treinameto onClickPredizer={handlePredizer} />
          </div>
          <div className="col">
            <Validacao onClickPredizer={handlePredizer} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
