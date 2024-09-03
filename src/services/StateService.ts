import { BehaviorSubject } from "rxjs";
import { PERCEPTRON_STATE } from "../pages/useConfig";

type IState = {
  codigo: boolean[];
  codigoEsperado: string;
  digitos: number;
  epocas: number;
};

const initial: IState = {
  codigo: [false, false, false],
  codigoEsperado: "010",
  digitos: 3,
  epocas: 5,
};

export class StateService {
  private state = new BehaviorSubject<IState>(initial);

  get state$() {
    return this.state.asObservable();
  }

  get codigo() {
    return this.state.value.codigo;
  }

  get codigoEsperado() {
    return this.state.value.codigoEsperado;
  }

  get digitos() {
    return this.state.value.digitos;
  }

  get epocas() {
    return this.state.value.epocas;
  }

  setCodigo(c: boolean[]) {
    let newState: IState = { ...this.state.value, codigo: c };
    this.state.next(newState);
    this.save();
  }

  setCodigoEsperado(c: string) {
    let newState: IState = { ...this.state.value, codigoEsperado: c };
    this.state.next(newState);
    this.save();
  }

  setEpocas(e: any) {
    let newState: IState = { ...this.state.value, epocas: Number(e.target.value) };
    this.state.next(newState);
    this.save();
  }

  validarCodigoEsperado(evt: any) {
    const digitos = evt.target.maxLength;
    const rgx = new RegExp(`^[01]{1,${digitos}}$`, "g");
    const rgxOk = (evt.target.value as string).match(rgx);
    if (rgxOk != null && evt.target.value != null) this.setCodigoEsperado(evt.target.value);
  }

  setDigitos(d: number) {
    if (d === this.state.value.digitos) return;
    let newState: IState = { ...this.state.value, digitos: d, codigo: Array(d).fill(false) };
    this.state.next(newState);
    this.save();
  }

  reiniciar() {
    this.setCodigo(this.codigo.map(() => false));
  }

  constructor() {
    this.load();
    this.setEpocas.bind(this);
  }

  private load() {
    const ls = localStorage.getItem(PERCEPTRON_STATE) ?? JSON.stringify(initial);
    this.state.next(JSON.parse(ls));
  }

  private save() {
    localStorage.setItem(PERCEPTRON_STATE, JSON.stringify(this.state.value));
  }
}
