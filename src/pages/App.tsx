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
  const [content1, setContent1] = useState(false);
  const [content2, setContent2] = useState(false);
  const [content3, setContent3] = useState(false);
  const [content4, setContent4] = useState(false);

  function reiniciar() {
    console.log("reiniciar");
    fecharCofre();
    setContent1(false);
    setContent2(false);
    setContent3(false);
    setContent4(false);
  }

  function getCodigo() {
    return [
      Number(content1) * 1000,
      Number(content2) * 1000,
      Number(content3) * 1000,
      Number(content4) * 1000,
    ];
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

  return (
    <div className="App">
      <h1>JS Perceptron</h1>
      <h2>Missão: ABRIR O COFRE</h2>

      <p className="mt-4">Código a ser analisado para ação</p>
      <div className="d-flex gap-3 justify-content-center">
        <Switch
          name="sw1"
          checked={content1}
          onChange={() => setContent1(!content1)}
        />
        <Switch
          name="sw2"
          checked={content2}
          onChange={() => setContent2(!content2)}
        />
        <Switch
          name="sw3"
          checked={content3}
          onChange={() => setContent3(!content3)}
        />
        <Switch
          name="sw4"
          checked={content4}
          onChange={() => setContent4(!content4)}
        />
      </div>

      <h3 className="mt-4 mb-1">Treinamento</h3>
      <p className="small">
        <span className="badge text-bg-danger">
          {aprendizado ? "APRENDIZADO" : "VALIDAÇÃO"}
        </span>
      </p>

      <div className="btn-group" role="group" aria-label="Aprendizado">
        <button
          disabled={!validarCodigo && aprendizado}
          className="btn btn-primary"
          type="button"
          onClick={handleValidar}
        >
          VALIDAR
        </button>
        <button
          className="me-3 btn btn-secondary"
          type="button"
          onClick={() => setAprendizado(!aprendizado)}
        >
          ALTERNAR MODO
        </button>
      </div>

      <div className="btn-group" role="group" aria-label="Correto ou incorreto">
        <button
          disabled={validarCodigo || !aprendizado}
          className="btn btn-primary"
          type="button"
          onClick={handleCorreto}
        >
          CORRETO
        </button>
        <button
          disabled={validarCodigo || !aprendizado}
          className="btn btn-warning"
          type="button"
          onClick={handleIncorreto}
        >
          INCORRETO
        </button>
      </div>

      <p className="mt-4">Ação a ser realizada pelo algoritmo</p>
      <div>
        <img
          src={cofreAberto ? img_cofre_aberto : img_cofre_fechado}
          alt="cofre aberto"
          width={100}
        />
      </div>
    </div>
  );
}

export default App;
