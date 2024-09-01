import { useState } from "react";

import logx from "../logx";
import usePerceptron from "./usePerceptron";

function useAutomatico() {
  const { respostaPositivaErrada, respostaNegativaErrada, predizer } =
    usePerceptron();
  const [respostaAutomatica, setRespostaAutomatica] = useState<string>("010");
  const [automaticoCorreto, setAutomaticoCorreto] = useState<boolean>(true);
  const [epochs, setEpochs] = useState(5);

  function handleRespostaAutomatica(e: any, digitos: number) {
    const rgx = new RegExp(`^[01]{1,${digitos}}$`, "g");
    const rgxOk = (e.target.value as string).match(rgx);
    if (rgxOk && e.target.value != null) setRespostaAutomatica(e.target.value);
    setAutomaticoCorreto(digitos === e.target.value.length);
  }

  function handleEpochs(e: any) {
    setEpochs(Number(e.target.value));
  }

  function itemsParaTeste(n: number): boolean[][] {
    const sequence: string[] = [];
    const totalNumbers = Math.pow(2, n);
    for (let i = 0; i < totalNumbers; i++) {
      const binaryString = i.toString(2).padStart(n, "0");
      sequence.push(binaryString);
    }
    return sequence.map((item) => {
      return item.split("").map((c) => {
        return Boolean(Number(c));
      });
    });
  }

  function getCodigo(codigo: boolean[]) {
    return [...codigo].map((x) => Number(x) + 0.5);
  }

  function treinamentoAutomatico(expected: boolean[]) {
    console.clear();
    let items: boolean[][] = itemsParaTeste(expected.length);
    let outputTable: any[] = [];
    let acertos = 0;
    for (let epoch = 0; epoch < epochs; epoch++) {
      for (let item = 0; item < items.length; item++) {
        const predicao = predizer(getCodigo(items[item]));
        const expectCheck = expected.reduce((p, c, idx) => {
          if (c !== items[item][idx]) return false;
          return p;
        }, true);
        if (predicao !== expectCheck) {
          if (predicao) respostaPositivaErrada(getCodigo(items[item]));
          else respostaNegativaErrada(getCodigo(items[item]));
        }
        outputTable.push({
          ...{ epoch: epoch + 1 },
          // items: JSON.stringify(getCodigo(items[item])),
          // expected_items: JSON.stringify(expected.map((itm) => Number(itm))),
          ...{ predicao: predicao },
          ...{ expected: expectCheck },
          ...{
            resultado:
              predicao !== expectCheck
                ? "ERROU"
                : expectCheck
                ? "ACERTOU CODIGO"
                : "",
          },
          ...{
            respostaPositiva: predicao,
          },
        });
        acertos += predicao === expectCheck && expectCheck ? 1 : 0;
      }
    }
    console.table(outputTable);
    logx.success("Acertos", acertos);
    if (acertos === 0)
      alert(
        `Não consegui aprender. \nTreinameto finalizado sem acertos em ${epochs} épocas e ${outputTable.length} testes. \nTente aumentar o valor de épocas de treinamento.`
      );
    else
      alert(
        `Treinamento finalizado com ${acertos} acertos em ${epochs} épocas e ${outputTable.length} testes.`
      );
  }

  return {
    automaticoCorreto,
    respostaAutomatica,
    epochs,
    handleEpochs,
    handleRespostaAutomatica,
    treinamentoAutomatico,
  };
}

export default useAutomatico;
