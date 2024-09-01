import { useState } from "react";

function useAutomatico() {
  const [respostaAutomatica, setRespostaAutomatica] = useState<string>("010");
  const [automaticoCorreto, setAutomaticoCorreto] = useState<boolean>(true);

  function handleRespostaAutomatica(e: any, digitos: number) {
    setRespostaAutomatica(e.target.value);
    setAutomaticoCorreto(digitos === e.target.value.length);
  }

  function treinamentoAutomatico() {}

  return {
    automaticoCorreto,
    respostaAutomatica,
    handleRespostaAutomatica,
    treinamentoAutomatico,
  };
}

export default useAutomatico;
