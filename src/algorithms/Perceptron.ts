import { BehaviorSubject } from "rxjs";
import { PERCEPTRON_PESOS } from "../pages/useConfig";
import logx from "../logx";

type IState = {
  pesos: number[];
  emAprendizado: boolean;
  ultimaPredicaoPositiva: boolean;
  predizerExecutado: boolean;
};

export const initialPerceptron: IState = {
  pesos: [0, 0, 0],
  emAprendizado: true,
  ultimaPredicaoPositiva: false,
  predizerExecutado: false,
};

export class Perceptron {
  private state = new BehaviorSubject<IState>(initialPerceptron);

  get state$() {
    return this.state.asObservable();
  }

  get pesos() {
    return this.state.value.pesos;
  }

  get emAprendizado() {
    return this.state.value.emAprendizado;
  }

  get ultimaPredicaoPositiva() {
    return this.state.value.ultimaPredicaoPositiva;
  }

  get predizerExecutado() {
    return this.state.value.predizerExecutado;
  }

  setPesos(p: number[]) {
    let newState: IState = { ...this.state.value, pesos: p };
    this.state.next(newState);
    this.save();
  }

  setUltimaPredicaoPositiva(p: boolean) {
    let newState: IState = { ...this.state.value, ultimaPredicaoPositiva: p };
    this.state.next(newState);
    this.save();
    return p;
  }

  setPredizerExecutado(p: boolean) {
    let newState: IState = { ...this.state.value, predizerExecutado: p };
    this.state.next(newState);
    this.save();
  }

  private iniciaAprendizado() {
    let newState: IState = { ...this.state.value, emAprendizado: true };
    this.state.next(newState);
  }

  private iniciaValidacao() {
    let newState: IState = { ...this.state.value, emAprendizado: false };
    this.state.next(newState);
  }

  toggleAprendizado() {
    this.setPredizerExecutado(false);
    if (this.emAprendizado) this.iniciaValidacao();
    else this.iniciaAprendizado();
  }

  constructor(private taxaAprendizado = 0.1) {
    this.load();
  }

  private load() {
    const ls = localStorage.getItem(PERCEPTRON_PESOS) ?? JSON.stringify(initialPerceptron);
    this.state.next(JSON.parse(ls));
    this.setPredizerExecutado(false);
    this.save();
  }

  private save() {
    localStorage.setItem(PERCEPTRON_PESOS, JSON.stringify(this.state.value));
  }

  inicializaPesos(codigo: number[]): void {
    let _pesos: number[] = [];
    const pesosVazios = this.pesos.length === 0;
    const pesosNaoIniciados = pesosVazios || this.pesos.reduce((p, c) => p + c, 0) === 0;
    const indicePesosAlterado = pesosVazios || this.pesos.length !== codigo.length;
    if (pesosNaoIniciados || indicePesosAlterado) {
      _pesos = Array(codigo.length).fill(0);
      _pesos = _pesos.map((x) => Math.random() * 2 - 1);
    } else _pesos = this.pesos;
    this.setPesos(_pesos);
  }

  private recalculoPeso(codigo: number[], erro: number, peso: number, index: number) {
    return peso + this.taxaAprendizado * erro * codigo[index];
  }

  private atualizaPesos(codigo: number[], erro: number) {
    const _pesos = this.pesos.map((peso, i) => this.recalculoPeso(codigo, erro, peso, i));
    logx.info("usePerceptron.atualizaPesos", JSON.stringify(codigo), JSON.stringify(_pesos));
    this.setPesos(_pesos);
  }

  respostaPositivaErrada(codigo: number[]) {
    if (!this.emAprendizado) return;
    let _erro = -1;
    this.atualizaPesos(codigo, _erro);
  }

  respostaNegativaErrada(codigo: number[]) {
    if (!this.emAprendizado) return;
    let _erro = 1;
    this.atualizaPesos(codigo, _erro);
  }

  predizer(codigo: number[]) {
    this.inicializaPesos(codigo);
    this.setPredizerExecutado(true);
    const _pesos_codigo = codigo.map((c, i) => c * (this.pesos[i] * 1.0));
    const _saida = _pesos_codigo.reduce((p, c) => p + c, 0.0);
    logx.error("predizer.codigo.pesos", JSON.stringify(codigo), JSON.stringify(this.pesos));
    const predicao = _saida >= 0;
    return this.setUltimaPredicaoPositiva(predicao);
  }

  reiniciar() {
    this.state.next(initialPerceptron);
    this.setPredizerExecutado(false);
    this.save();
  }
}
