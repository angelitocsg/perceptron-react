import { useEffect, useState } from "react";
import logx from "../logx";

function usePerceptron(taxaAprendizado: number = 0.1) {
  const [retornoPositivo, setPositivo] = useState(false);
  const [pesos, setPesos] = useState<number[]>([]);
  const [validarCodigo, setValidarCodigo] = useState(true);
  const [emAprendizado, setAprendizado] = useState(true);

  useEffect(() => {
    logx.warn("pesos", JSON.stringify(pesos));
  }, [pesos]);

  useEffect(() => {
    logx.info("positivo", retornoPositivo);
  }, [retornoPositivo]);

  useEffect(() => {
    logx.info("aprendizado", String(emAprendizado));
  }, [emAprendizado]);

  function inicializaPesos(codigo: number[]) {
    if (pesos.length === 0) {
      const _pesos = Array(codigo.length).fill(Math.random() * 2 - 1);
      setPesos(_pesos);
      return _pesos;
    }
    return pesos;
  }

  function atualizaPesos(codigo: number[], erro: number) {
    const _pesos = pesos.map((peso, i) => {
      console.log({
        final: peso + taxaAprendizado * erro * codigo[i],
        peso,
        erro,
        codigo: codigo[i],
      });

      return peso + taxaAprendizado * erro * codigo[i];
    });
    setPesos(_pesos);
  }

  function respostaPositivaErrada(codigo: number[]) {
    if (!emAprendizado) return;
    let _erro = -1;
    atualizaPesos(codigo, _erro);
  }

  function respostaNegativaErrada(codigo: number[]) {
    if (!emAprendizado) return;
    let _erro = 1;
    atualizaPesos(codigo, _erro);
  }

  function predizer(codigo: number[]) {
    setValidarCodigo(false);
    let _pesos = inicializaPesos(codigo);
    let _pesos_codigo = codigo.map((c, i) => c * (_pesos[i] * 1.0));
    let _saida = _pesos_codigo.reduce((p, c) => p + c, 0.0);
    logx.error("pesos", JSON.stringify(_pesos));
    return setPositivo(_saida >= 0);
  }

  function reiniciar() {
    setValidarCodigo(true);
    setPositivo(false);
  }

  return {
    respostaPositivaErrada,
    respostaNegativaErrada,
    predizer,
    setAprendizado,
    reiniciar,
    retornoPositivo,
    emAprendizado,
    validarCodigo,
  };
}

export default usePerceptron;
