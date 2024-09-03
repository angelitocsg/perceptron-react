import { useEffect, useState } from "react";

import { AutoTraining } from "../../algorithms/AutoTraining";
import { Perceptron } from "../../algorithms/Perceptron";
import img_cofre_aberto from "../../assets/cofre_aberto.png";
import img_cofre_fechado from "../../assets/cofre_fechado.png";
import Button from "../../components/button";
import ButtonGroup from "../../components/buttonGroup";
import CardContent from "../../components/cardContent";
import Loader from "../../components/loader";
import Widget from "../../components/widget";
import { useService } from "../../di/DecouplerContext";
import { ServiceName } from "../../di/ServiceName";
import { ScreenService } from "../../services/ScreenService";
import { StateService } from "../../services/StateService";
import useConfig from "../useConfig";

function Validacao({ onClickPredizer }: { onClickPredizer: () => void }) {
  const { config } = useConfig();
  const perceptron = useService<Perceptron>(ServiceName.PerceptronService);
  const screenService = useService<ScreenService>(ServiceName.ScreenService);
  const stateService = useService<StateService>(ServiceName.StateService);
  const [loading, setLoading] = useState(false);
  const [emValidacao, setEmValidacao] = useState(false);
  const [perceptronState, setPerceptronState] = useState({
    emAprendizado: perceptron.emAprendizado,
    predizerExecutado: perceptron.predizerExecutado,
    ultimaPredicaoPositiva: perceptron.ultimaPredicaoPositiva,
  });

  useEffect(() => {
    const subscriber = perceptron.state$.subscribe((value) => {
      setPerceptronState({
        emAprendizado: value.emAprendizado,
        predizerExecutado: value.predizerExecutado,
        ultimaPredicaoPositiva: value.ultimaPredicaoPositiva,
      });
    });
    return () => {
      subscriber.unsubscribe();
    };
  }, [perceptron]);

  useEffect(() => {
    setEmValidacao(!(perceptronState.emAprendizado || !perceptronState.predizerExecutado));
  }, [perceptronState.emAprendizado, perceptronState.predizerExecutado]);

  useEffect(() => {
    const subscriber = screenService.state$.subscribe((value) => {
      setLoading(value.loading);
    });
    return () => {
      subscriber.unsubscribe();
    };
  }, [screenService]);

  function handleReiniciar() {
    stateService.reiniciar();
    perceptron.setPredizerExecutado(false);
  }

  function handleCorreto() {
    handleReiniciar();
  }

  function handleIncorreto() {
    handleReiniciar();
    if (perceptron.ultimaPredicaoPositiva)
      perceptron.respostaPositivaErrada(AutoTraining.getBoolAsNumber(stateService.codigo));
    else perceptron.respostaNegativaErrada(AutoTraining.getBoolAsNumber(stateService.codigo));
  }

  return (
    <Widget title="Validação">
      <CardContent maxWidth={config.maxWidth} color={emValidacao ? "light" : "body-secondary"}>
        {perceptronState.emAprendizado ? (
          <>
            No modo de aprendizado manual você deve informar se a predição está "CORRETA" ou
            "INCORRETA", repetindo até o algoritmo aprender.
          </>
        ) : (
          <>
            No modo de validação você deve informar o código acima e clicar em "PREDIÇÃO", o
            algoritmo responderá com base no aprendizado.
          </>
        )}
      </CardContent>
      {perceptronState.emAprendizado ? (
        <ButtonGroup>
          <Button
            label="CORRETO"
            disabled={!perceptronState.predizerExecutado}
            color="primary"
            minWidth={config.minWidth}
            onClick={handleCorreto}
          />
          <Button
            label="INCORRETO"
            disabled={!perceptronState.predizerExecutado}
            color="warning"
            minWidth={config.minWidth}
            onClick={handleIncorreto}
          />
        </ButtonGroup>
      ) : (
        <Button
          label="PREDIÇÃO"
          color="primary"
          minWidth={config.minWidth * 2}
          onClick={onClickPredizer}
        />
      )}
      <br />
      <CardContent>
        {loading ? (
          <Loader />
        ) : (
          <img
            src={perceptronState.ultimaPredicaoPositiva ? img_cofre_aberto : img_cofre_fechado}
            alt="cofre aberto"
            width={150}
          />
        )}
      </CardContent>
    </Widget>
  );
}

export default Validacao;
