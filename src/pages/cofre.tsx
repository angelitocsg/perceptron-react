import { useEffect, useState } from "react";
import logx from "../logx";

function useCofre(taxaAprendizado: number = 0.1) {
  const [cofreAberto, setCofreAberto] = useState(false);
  const [pesos, setPesos] = useState<number[]>([]);
  const [validarCodigo, setValidarCodigo] = useState(true);
  const [aprendizado, setAprendizado] = useState(true);

  useEffect(() => {
    logx.warn("pesos", JSON.stringify(pesos));
  }, [pesos]);

  useEffect(() => {
    logx.info("cofreAberto", cofreAberto);
  }, [cofreAberto]);

  useEffect(() => {
    logx.info("validarCodigo", validarCodigo);
  }, [validarCodigo]);

  useEffect(() => {
    logx.info("aprendizado", String(aprendizado));
  }, [aprendizado]);

  function inicializaPesos(codigo: number[]) {
    if (pesos.length === 0) {
      const _pesos = Array(codigo.length).fill(0.0);
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

  function cofreAbertoErrado(codigo: number[]) {
    if (!aprendizado) return;
    let _erro = -1;
    atualizaPesos(codigo, _erro);
  }

  function cofreFechadoErrado(codigo: number[]) {
    if (!aprendizado) return;
    let _erro = 1;
    atualizaPesos(codigo, _erro);
  }

  function deveAbrirCofre(codigo: number[]) {
    setValidarCodigo(false);
    let _pesos = inicializaPesos(codigo);
    let _pesos_codigo = codigo.map((c, i) => c * (_pesos[i] * 1.0));
    let _saida = _pesos_codigo.reduce((p, c) => p + c, 0.0);
    logx.error("pesos", JSON.stringify(_pesos));
    return setCofreAberto(_saida >= 0);
  }

  function fecharCofre() {
    setValidarCodigo(true);
    setCofreAberto(false);
  }

  return {
    cofreAbertoErrado,
    cofreFechadoErrado,
    deveAbrirCofre,
    setAprendizado,
    fecharCofre,
    cofreAberto,
    aprendizado,
    validarCodigo,
  };
}

export default useCofre;
