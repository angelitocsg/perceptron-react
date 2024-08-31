import Switch from "../components/switch";
import "./App.css";
import { useState } from "react";
import img_cofre_aberto from "../assets/cofre_aberto.png";
import img_cofre_fechado from "../assets/cofre_fechado.png";
import useCofre from "./cofre";

function App() {
  const {
    cofreAbertoErrado,
    cofreFechadoErrado,
    deveAbrirCofre,
    setAprendizado,
    fecharCofre,
    cofreAberto,
    aprendizado,
    validarCodigo,
  } = useCofre();
  const [content, setContent] = useState<boolean[]>([false, false, false]);

  function reiniciar() {
    fecharCofre();
    setContent(content.map(() => false));
  }

  function getCodigo() {
    return content.map((x) => Number(x) + 1);
  }

  function handleValidar() {
    deveAbrirCofre(getCodigo());
  }

  function handleCorreto() {
    reiniciar();
  }

  function handleIncorreto() {
    reiniciar();
    if (cofreAberto) cofreAbertoErrado(getCodigo());
    else cofreFechadoErrado(getCodigo());
  }

  function handleContentSwitch(value: boolean, index: number) {
    setContent(content.map((item, i) => (i === index ? value : item)));
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <h1 className="mt-4">ALGORITMO PERCEPTRON</h1>
      <h2 className="mt-4">Aprender código que abre o cofre</h2>

      <p className="mt-4">Código a ser analisado para ação</p>
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

      <h3 className="mt-4 mb-1">Treinamento</h3>
      <div className="d-flex flex-column align-items-center">
        <p className="small">
          <span className="badge text-bg-danger">
            {aprendizado ? "APRENDIZADO" : "VALIDAÇÃO"}
          </span>
        </p>
        {aprendizado && (
          <div className="card mb-3" style={{ maxWidth: 500 }}>
            <div className="card-body">
              <div className="card-text">
                No modo de aprendizado você deve informar um código, clicar em
                "VALIDAR" e após a ação ser realizada informar se está correto
                ou incorreto clicando nos respectivos botões.
              </div>
            </div>
          </div>
        )}
        {!aprendizado && (
          <div className="card mb-3" style={{ maxWidth: 500 }}>
            <div className="card-body">
              <div className="card-text">
                No modo de validação você deve informar um código, clicar em
                "VALIDAR" e após a ação aprendida será executada.
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="btn-group" role="group" aria-label="Aprendizado">
        <button
          disabled={!validarCodigo && aprendizado}
          className="btn btn-primary"
          type="button"
          style={{ minWidth: 200 }}
          onClick={handleValidar}
        >
          VALIDAR
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          style={{ minWidth: 200 }}
          onClick={() => setAprendizado(!aprendizado)}
        >
          ALTERNAR MODO
        </button>
      </div>

      <p className="mt-4">Ação a ser realizada pelo algoritmo</p>
      <div className="mb-4">
        <img
          src={cofreAberto ? img_cofre_aberto : img_cofre_fechado}
          alt="cofre aberto"
          width={150}
        />
      </div>

      {aprendizado && (
        <div
          className="btn-group"
          role="group"
          aria-label="Correto ou incorreto"
        >
          <button
            disabled={validarCodigo || !aprendizado}
            className="btn btn-primary"
            type="button"
            style={{ minWidth: 200 }}
            onClick={handleCorreto}
          >
            CORRETO
          </button>
          <button
            disabled={validarCodigo || !aprendizado}
            className="btn btn-warning"
            type="button"
            style={{ minWidth: 200 }}
            onClick={handleIncorreto}
          >
            INCORRETO
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
