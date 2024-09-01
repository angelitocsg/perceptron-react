import { useEffect, useRef, useState } from "react";

import logx from "../logx";

export const PERCEPTRON_PESOS = "perceptron-pesos";

function usePerceptron(taxaAprendizado: number = 0.1) {
  const [retornoPositivo, setPositivo] = useState(false);
  const pesosRef = useRef<number[]>([]);
  const [validarCodigo, setValidarCodigo] = useState(true);
  const [emAprendizado, setAprendizado] = useState(true);

  useEffect(() => {
    logx.warn("usePerceptron.pesos", JSON.stringify(pesosRef.current));
    if (pesosRef.current.length > 0)
      localStorage.setItem(PERCEPTRON_PESOS, JSON.stringify(pesosRef.current));
  }, [pesosRef]);

  // useEffect(() => {
  //   logx.info("usePerceptron.positivo", retornoPositivo);
  // }, [retornoPositivo]);

  // useEffect(() => {
  //   logx.info("usePerceptron.aprendizado", String(emAprendizado));
  // }, [emAprendizado]);

  function inicializaPesos(codigo: number[]) {
    const tmp = JSON.parse(
      localStorage.getItem(PERCEPTRON_PESOS) ?? "[]"
    ) as number[];
    if (
      pesosRef.current.length === 0 ||
      pesosRef.current.reduce((p, c) => p + c) === 0
    )
      pesosRef.current = tmp;
    if (pesosRef.current.length === 0) {
      // const rand = Math.random() * 2 - 1;
      const _pesos = Array(codigo.length).fill(0);
      pesosRef.current = _pesos;
      return _pesos;
    }
    return pesosRef.current;
  }

  function atualizaPesos(codigo: number[], erro: number) {
    const _pesos = pesosRef.current.map((peso, i) => 
       peso + taxaAprendizado * erro * codigo[i]
    );
    logx.info(
      "usePerceptron.atualizaPesos",
      JSON.stringify(codigo),
      JSON.stringify(_pesos)
    );
    pesosRef.current = _pesos;
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
    logx.error(
      "predizer.codigo.pesos",
      JSON.stringify(codigo),
      JSON.stringify(_pesos)
    );
    setPositivo(_saida >= 0);
    return _saida >= 0;
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
    pesos: pesosRef,
    retornoPositivo,
    emAprendizado,
    validarCodigo,
  };
}

export default usePerceptron;
