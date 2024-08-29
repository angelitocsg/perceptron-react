import { useState } from "react";

function useCofre(taxaAprendizado: number = 0.1) {
  const [cofreAberto, setCofreAberto] = useState(false);
  const [pesos, setPesos] = useState<number[]>([]);
  const [validarCodigo, setValidarCodigo] = useState(true);
  const [aprendizado, setAprendizado] = useState(true);

  function inicializaPesos(codigo: number[]) {
    console.log("inicializaPesos", pesos);
    console.log( pesos);
    if (pesos.length === 0) {
      const _pesos = Array(codigo.length).fill(0.0);
      setPesos(_pesos);
      return _pesos;
    }
    return pesos;
  }

  function atualizaPesos(codigo: number[], erro: number) {
    console.log("atualizaPesos");
    const _pesos = pesos.map(
      (peso, i) => peso + taxaAprendizado * erro * codigo[i]
    );
    console.log(pesos);
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
    console.log(codigo);
    let _pesos = inicializaPesos(codigo);
    let _pesos_codigo = codigo.map((c, i) => (c) * _pesos[i]);
    let _saida = _pesos_codigo.reduce((p, c) => p + c, 0.0);
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
    validarCodigo
  };
}

export default useCofre;
