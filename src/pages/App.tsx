import "./App.css";

import { useEffect, useState } from "react";

import img_cofre_aberto from "../assets/cofre_aberto.png";
import img_cofre_fechado from "../assets/cofre_fechado.png";
import Button from "../components/button";
import ButtonGroup from "../components/buttonGroup";
import CardContent from "../components/cardContent";
import Loader from "../components/loader";
import Switch from "../components/switch";
import Widget from "../components/widget";
import useAutomatico from "./useAutomatico";
import usePerceptron, { PERCEPTRON_PESOS } from "./usePerceptron";

const state = {
  initial: 3,
  max: 6,
  min: 3,
  minWidth: 170,
};

function App() {
  const [digitos, setDigitos] = useState(state.initial);
  const [content, setContent] = useState<boolean[]>([]);
  const [loading, setLoading] = useState<boolean>();

  const {
    respostaPositivaErrada,
    respostaNegativaErrada,
    predizer,
    setAprendizado,
    reiniciar,
    retornoPositivo,
    emAprendizado,
    validarCodigo,
  } = usePerceptron();

  const {
    automaticoCorreto,
    respostaAutomatica,
    epochs,
    handleRespostaAutomatica,
    handleEpochs,
    treinamentoAutomatico,
  } = useAutomatico();

  useEffect(() => {
    setContent(Array(Number(digitos)).fill(false));
  }, [digitos]);

  function handleReiniciar() {
    reiniciar();
    setContent(content.map(() => false));
  }

  function getCodigo() {
    return content.map((x) => Number(x) + 0.5);
  }

  function handleValidar() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    predizer(getCodigo());
  }

  function handleCorreto() {
    handleReiniciar();
  }

  function handleIncorreto() {
    handleReiniciar();
    if (retornoPositivo) respostaPositivaErrada(getCodigo());
    else respostaNegativaErrada(getCodigo());
  }

  function handleContentSwitch(value: boolean, index: number) {
    setContent(content.map((item, i) => (i === index ? value : item)));
  }

  function handleChange(e: any) {
    if (
      e.target.value &&
      Number(e.target.value) >= state.min &&
      Number(e.target.value) <= state.max
    ) {
      setDigitos(Number(e.target.value));
      handleRespostaAutomatica(
        { target: { value: respostaAutomatica } },
        Number(e.target.value)
      );
      localStorage.setItem(PERCEPTRON_PESOS, "[]");
    }
  }

  function handleAutomatico() {
    if (!automaticoCorreto) return;
    let values = respostaAutomatica.split("");
    treinamentoAutomatico(values.map((v) => v === "1"));
  }

  function limparTudo() {
    if (window.confirm("Deseja continuar e perder os dados de aprendizado?")) {
      localStorage.setItem(PERCEPTRON_PESOS, "[]");
      window.location.reload();
    }
  }

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column align-items-center">
        <h1 className="mt-4">ALGORITMO PERCEPTRON</h1>

        <Widget title="Aprender código que abre o cofre">
          <p className="mt-4">Código a ser analisado para ação</p>
          <CardContent>
            <div className="d-flex gap-3 justify-content-center">
              {content.map((item, i) => (
                <Switch
                  key={"sw" + i}
                  name={"sw" + i}
                  checked={item}
                  onChange={() => handleContentSwitch(!item, i)}
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
              min={state.min}
              max={state.max}
              value={digitos}
              onChange={(e) => handleChange(e)}
            />
            <Button
              label="ALTERNAR MODO"
              minWidth={state.minWidth}
              color="secondary"
              onClick={() => setAprendizado(!emAprendizado)}
            />
          </ButtonGroup>
        </Widget>

        <div className="row">
          <div className="col">
            <Widget title="Treinamento">
              <CardContent
                maxWidth={500}
                color={
                  !emAprendizado || validarCodigo ? "light" : "secondary-subtle"
                }
              >
                No modo de aprendizado você deve informar um código, clicar em
                "MANUAL" e após a ação ser realizada informar se está correto ou
                incorreto clicando nos respectivos botões.
              </CardContent>
              <ButtonGroup>
                <Button
                  label="MANUAL"
                  disabled={!emAprendizado || !validarCodigo}
                  minWidth={state.minWidth}
                  color="primary"
                  onClick={handleValidar}
                />
                <Button
                  label="AUTOMÁTICO"
                  disabled={!emAprendizado || !automaticoCorreto}
                  minWidth={state.minWidth}
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
                      name="respostaAutomatica"
                      type="text"
                      className="form-control mt-2"
                      style={{ textAlign: "center" }}
                      maxLength={digitos}
                      value={respostaAutomatica}
                      onChange={(e) => handleRespostaAutomatica(e, digitos)}
                    />
                    {!automaticoCorreto && (
                      <span className="small text-danger">
                        * deve ter {digitos} dígitos
                      </span>
                    )}
                  </CardContent>
                </div>
                <div className="col">
                  <CardContent>
                    Épocas
                    <input
                      name="epochs"
                      type="number"
                      className="form-control mt-2"
                      style={{ textAlign: "center" }}
                      min={5}
                      max={500}
                      value={epochs}
                      onChange={handleEpochs}
                    />
                  </CardContent>
                </div>
              </div>
              <Button
                label="REINICIAR E LIMPAR APRENDIZADO"
                color="bg-dark-subtle"
                minWidth={state.minWidth * 2}
                onClick={limparTudo}
              ></Button>
            </Widget>
          </div>
          <div className="col">
            <Widget title="Validação">
              <CardContent
                maxWidth={500}
                color={
                  emAprendizado && !validarCodigo ? "light" : "secondary-subtle"
                }
              >
                {emAprendizado ? (
                  <>
                    No modo de aprendizado manual você deve informar se a
                    predição está "CORRETA" ou "INCORRETA", repetindo até o
                    algoritmo aprender.
                  </>
                ) : (
                  <>
                    No modo de validação você deve informar o código acima e
                    clicar em "PREDIÇÃO", o algoritmo responderá com base no
                    aprendizado.
                  </>
                )}
              </CardContent>
              {emAprendizado ? (
                <ButtonGroup>
                  <Button
                    label="CORRETO"
                    disabled={validarCodigo || !emAprendizado}
                    color="primary"
                    minWidth={state.minWidth}
                    onClick={handleCorreto}
                  />
                  <Button
                    label="INCORRETO"
                    disabled={validarCodigo || !emAprendizado}
                    color="warning"
                    minWidth={state.minWidth}
                    onClick={handleIncorreto}
                  />
                </ButtonGroup>
              ) : (
                <Button
                  label="PREDIÇÃO"
                  color="primary"
                  minWidth={state.minWidth * 2}
                  onClick={handleValidar}
                />
              )}
              <br />
              <CardContent>
                {loading ? (
                  <Loader />
                ) : (
                  <img
                    src={retornoPositivo ? img_cofre_aberto : img_cofre_fechado}
                    alt="cofre aberto"
                    width={150}
                  />
                )}
              </CardContent>
            </Widget>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
