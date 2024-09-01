export default class logx {
  static colors = {
    default: "color: inherit; background: inherit",
    danger: "color: #FFF; background: #7D2121",
    warn: "color: #FFF; background: #b27300",
    info: "color: #FFF; background: #0021FF",
    code: "color: #FFF; background: #333",
    success: "color: #FFF; background: #009900",
    firebase: "color: #333; background: #FFA000",
    page: "color: #FFF; background: #00549e",
    pageReturn: "color: #999; background: #01335e",
  };

  static error(message: string, ...optionalParams: any[]) {
    optionalParams && optionalParams.length > 0
      ? console.log(`%c${message}`, this.colors.danger, optionalParams)
      : console.log(`%c${message}`, this.colors.danger);
  }

  static warn(message: string, ...optionalParams: any[]) {
    optionalParams && optionalParams.length > 0
      ? console.log(`%c${message}`, this.colors.warn, optionalParams)
      : console.log(`%c${message}`, this.colors.warn);
  }

  static info(message: string, ...optionalParams: any[]) {
    optionalParams && optionalParams.length > 0
      ? console.log(`%c${message}`, this.colors.info, optionalParams)
      : console.log(`%c${message}`, this.colors.info);
  }
  
  static success(message: string, ...optionalParams: any[]) {
    optionalParams && optionalParams.length > 0
      ? console.log(`%c${message}`, this.colors.success, optionalParams)
      : console.log(`%c${message}`, this.colors.success);
  }

  static page(message: string, param: string = "") {
    console.log(
      `%c[page] ${message}%c %c${param}`,
      this.colors.page,
      this.colors.default,
      this.colors.danger
    );
  }

  static pageReturn(message: string, param: string = "") {
    console.log(
      `%c[page] ${message}%c %c${param}`,
      this.colors.pageReturn,
      this.colors.default,
      this.colors.danger
    );
  }

  static service(message: string, param: string = "") {
    console.log(
      `%c[service] ${message}%c %c${param}`,
      this.colors.success,
      this.colors.default,
      this.colors.danger
    );
  }

  static firebase(message: string, param: string = "") {
    console.log(
      `%c[firebase] ${message}%c %c${param}`,
      this.colors.firebase,
      this.colors.default,
      this.colors.danger
    );
  }

  static json(json: any) {
    console.log(`%c${JSON.stringify(json)}`, this.colors.code);
  }

  static jsonMsg(message: string, json: any, format?: boolean) {
    console.log(
      `%c${message}%c ${
        format ? JSON.stringify(json, null, 2) : JSON.stringify(json)
      }`,
      this.colors.info,
      this.colors.default
    );
  }
}
