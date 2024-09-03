import { useEffect, useState } from "react";

import { AutoTraining } from "../../algorithms/AutoTraining";
import { Perceptron } from "../../algorithms/Perceptron";
import Button from "../../components/button";
import ButtonGroup from "../../components/buttonGroup";
import CardContent from "../../components/cardContent";
import Widget from "../../components/widget";
import { useService } from "../../di/DecouplerContext";
import { ServiceName } from "../../di/ServiceName";
import { ScreenService } from "../../services/ScreenService";
import { StateService } from "../../services/StateService";
import useConfig from "../useConfig";

function Treinameto({ onClickPredizer }: { onClickPredizer: () => void }) {
  const { config } = useConfig();
  const autoTrainService = useService<AutoTraining>(ServiceName.AutoTrainService);
  const perceptron = useService<Perceptron>(ServiceName.PerceptronService);
  const screenService = useService<ScreenService>(ServiceName.ScreenService);
  const stateService = useService<StateService>(ServiceName.StateService);
  const [codigoEsperado, setCodigoEsperado] = useState(stateService.codigoEsperado);
  const [epocas, setEpocas] = useState(stateService.epocas);
  const [emValidacao, setEmValidacao] = useState(false);
  const [perceptronState, setPerceptronState] = useState({
    emAprendizado: perceptron.emAprendizado,
    predizerExecutado: perceptron.predizerExecutado,
  });

  useEffect(() => {
    const subscriber = perceptron.state$.subscribe((value) => {
      setPerceptronState({
        emAprendizado: value.emAprendizado,
        predizerExecutado: value.predizerExecutado,
      });
    });
    return () => {
      subscriber.unsubscribe();
    };
  }, [perceptron]);

  useEffect(() => {
    setEmValidacao(!(perceptronState.emAprendizado || !perceptronState.predizerExecutado));
  }, [perceptronState.emAprendizado, perceptronState.predizerExecutado]);

  function codigoEsperadoValido() {
    return screenService.getCodigoEsperadoValido(stateService.digitos, stateService.codigoEsperado);
  }

  function handleAutomatico() {
    if (!codigoEsperadoValido()) return;
    let values = stateService.codigoEsperado.split("");
    autoTrainService.treinar(
      perceptron,
      stateService,
      values.map((v) => v === "1")
    );
  }

  function handleCodigoEsperado(e: any) {
    stateService.validarCodigoEsperado(e);
    setCodigoEsperado(stateService.codigoEsperado);
  }

  function handleEpocas(e: any) {
    stateService.setEpocas(e);
    setEpocas(Number(e.target.value));
  }

  function limparTudo() {
    if (window.confirm("Deseja continuar e perder os dados de aprendizado?")) {
      stateService.reiniciar();
      perceptron.reiniciar();
      window.location.reload();
    }
  }

  return (
    <Widget title="Treinamento">
      <CardContent maxWidth={config.maxWidth} color={!emValidacao ? "light" : "body-secondary"}>
        No modo de aprendizado você deve informar um código, clicar em "MANUAL" e após a ação ser
        realizada informar se está correto ou incorreto clicando nos respectivos botões.
      </CardContent>
      <ButtonGroup>
        <Button
          label="MANUAL"
          disabled={!perceptronState.emAprendizado || perceptronState.predizerExecutado}
          minWidth={config.minWidth}
          color="primary"
          onClick={onClickPredizer}
        />
        <Button
          label="AUTOMÁTICO"
          disabled={
            !perceptronState.emAprendizado ||
            perceptronState.predizerExecutado ||
            !codigoEsperadoValido()
          }
          minWidth={config.minWidth}
          color="warning"
          onClick={handleAutomatico}
        />
      </ButtonGroup>
      <br />
      <div className="row">
        <div className="col">
          <CardContent>
            Código esperado
            <input
              disabled={emValidacao}
              name="respostaAutomatica"
              type="text"
              className="form-control mt-2"
              style={{ textAlign: "center" }}
              maxLength={stateService.digitos}
              value={codigoEsperado}
              onChange={handleCodigoEsperado}
            />
            {!codigoEsperadoValido() && (
              <span className="small text-danger">* deve ter {stateService.digitos} dígitos</span>
            )}
          </CardContent>
        </div>
        <div className="col">
          <CardContent>
            Épocas
            <input
              disabled={emValidacao}
              name="epochs"
              type="number"
              className="form-control mt-2"
              style={{ textAlign: "center" }}
              min={5}
              max={500}
              value={epocas}
              onChange={handleEpocas}
            />
          </CardContent>
        </div>
      </div>
      <Button
        label="REINICIAR E LIMPAR APRENDIZADO"
        color="bg-dark-subtle"
        minWidth={config.minWidth * 2}
        onClick={limparTudo}></Button>
    </Widget>
  );
}

export default Treinameto;
