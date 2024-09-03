import { BehaviorSubject } from "rxjs";

type IState = {
  loading: boolean;
};

const initial: IState = {
  loading: false,
};

export class ScreenService {
  private state = new BehaviorSubject<IState>(initial);

  get state$() {
    return this.state.asObservable();
  }

  get loading() {
    return this.state.value.loading;
  }

  getCodigoEsperadoValido(digitos: number, codigoEsperado: string) {
    return digitos === codigoEsperado.length;
  }

  setLoading(loading: boolean) {
    let newState: IState = { ...this.state.value, loading: loading };
    this.state.next(newState);
  }
}
