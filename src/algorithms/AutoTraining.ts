import { BehaviorSubject } from "rxjs";
import { StateService } from "../services/StateService";
import { Perceptron } from "./Perceptron";
import logx from "../logx";

type IState = {
  loading: boolean;
};

const initial: IState = {
  loading: false,
};

export class AutoTraining {
  private state = new BehaviorSubject<IState>(initial);

  get state$() {
    return this.state.asObservable();
  }

  get loading() {
    return this.state.value.loading;
  }

  static getBoolAsNumber(codigo: boolean[]) {
    return codigo.map((x) => Number(x) + 0.5);
  }

  treinar(perceptron: Perceptron, stateService: StateService, expected: boolean[]) {
    console.clear();
    let items: boolean[][] = this.itemsParaTeste(expected.length);
    let outputTable: any[] = [];
    let acertos = 0;
    for (let epoch = 0; epoch < stateService.epocas; epoch++) {
      for (let item = 0; item < items.length; item++) {
        const predicao = perceptron.predizer(AutoTraining.getBoolAsNumber(items[item]));
        const expectCheck = expected.reduce((p, c, idx) => {
          if (c !== items[item][idx]) return false;
          return p;
        }, true);
        if (predicao !== expectCheck) {
          if (predicao)
            perceptron.respostaPositivaErrada(AutoTraining.getBoolAsNumber(items[item]));
          else perceptron.respostaNegativaErrada(AutoTraining.getBoolAsNumber(items[item]));
        }
        outputTable.push({
          ...{ epoch: epoch + 1 },
          // items: JSON.stringify(getCodigo(items[item])),
          // expected_items: JSON.stringify(expected.map((itm) => Number(itm))),
          ...{ predicao: predicao },
          ...{ expected: expectCheck },
          ...{
            resultado: predicao !== expectCheck ? "ERROU" : expectCheck ? "ACERTOU CODIGO" : "",
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
        `Não consegui aprender. \nTreinameto finalizado sem acertos em ${stateService.epocas} épocas e ${outputTable.length} testes. \nTente aumentar o valor de épocas de treinamento.`
      );
    else
      alert(
        `Treinamento finalizado com ${acertos} acertos em ${stateService.epocas} épocas e ${outputTable.length} testes.`
      );
    perceptron.setPredizerExecutado(false);
  }

  private itemsParaTeste(n: number): boolean[][] {
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
}
