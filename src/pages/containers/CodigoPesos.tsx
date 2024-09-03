import { useEffect, useState } from "react";

import { initialPerceptron, Perceptron } from "../../algorithms/Perceptron";
import Button from "../../components/button";
import ButtonGroup from "../../components/buttonGroup";
import CardContent from "../../components/cardContent";
import Switch from "../../components/switch";
import Widget from "../../components/widget";
import { useService } from "../../di/DecouplerContext";
import { ServiceName } from "../../di/ServiceName";
import { StateService } from "../../services/StateService";
import useConfig, { PERCEPTRON_PESOS } from "../useConfig";
import { AutoTraining } from "../../algorithms/AutoTraining";

function CodigoPesos() {
  const { config } = useConfig();
  const perceptron = useService<Perceptron>(ServiceName.PerceptronService);
  const stateService = useService<StateService>(ServiceName.StateService);
  const [currentState, setCurrentState] = useState({
    codigo: stateService.codigo,
    digitos: stateService.digitos,
  });
  const [pesos, setPesos] = useState(perceptron.pesos);

  useEffect(() => {
    const subscriber = perceptron.state$.subscribe((value) => {
      setPesos(value.pesos);
    });
    return () => {
      subscriber.unsubscribe();
    };
  }, [perceptron]);

  useEffect(() => {
    const subscriber = stateService.state$.subscribe((value) => {
      setCurrentState({
        codigo: value.codigo,
        digitos: value.digitos,
      });
      perceptron.inicializaPesos(AutoTraining.getBoolAsNumber(value.codigo));
    });
    return () => {
      subscriber.unsubscribe();
    };
  }, [stateService, perceptron]);

  function handleCodigoSwitches(value: boolean, index: number) {
    stateService.setCodigo(currentState.codigo.map((item, i) => (i === index ? value : item)));
  }

  function handleDigitos(e: any) {
    if (
      e.target.value &&
      Number(e.target.value) >= config.min &&
      Number(e.target.value) <= config.max
    ) {
      stateService.setDigitos(Number(e.target.value));
      localStorage.setItem(PERCEPTRON_PESOS, JSON.stringify(initialPerceptron));
    }
  }

  function handleToggle() {
    perceptron.toggleAprendizado();
  }

  return (
    <Widget title="Aprender código que abre o cofre">
      <p className="mt-4">Código a ser analisado para ação</p>
      <CardContent>
        <div className="d-flex gap-3 justify-content-center">
          {currentState.codigo.map((item, i) => (
            <Switch
              key={"sw" + i}
              name={"sw" + i}
              checked={item}
              onChange={() => handleCodigoSwitches(!item, i)}
            />
          ))}
        </div>
      </CardContent>
      <ButtonGroup group="input">
        <span className="input-group-text">Dígitos</span>
        <input
          name="digitos"
          type="number"
          className="form-control"
          placeholder="0"
          style={{ maxWidth: 80 }}
          min={config.min}
          max={config.max}
          value={currentState.digitos}
          onChange={(e) => handleDigitos(e)}
        />
        <Button
          label="ALTERNAR MODO"
          minWidth={config.minWidth}
          color="secondary"
          onClick={handleToggle}
        />
      </ButtonGroup>
      <p className="mt-3 mb-1">Pesos</p>
      <CardContent padding={"5px 10px"}>
        <div className="row flex-row">
          {pesos
            .map((x) => Math.round(x * 1000) / 1000)
            .map((x, i) => (
              <div key={i} className="col">
                {x}
              </div>
            ))}
        </div>
      </CardContent>
    </Widget>
  );
}

export default CodigoPesos;
