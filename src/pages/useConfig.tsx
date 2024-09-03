export const PERCEPTRON_PESOS = "perceptron-pesos";
export const PERCEPTRON_STATE = "perceptron-state";

function useConfig() {
  const config = {
    max: 6,
    min: 3,
    minWidth: 170,
    maxWidth: 500
  };
  return { config };
}

export default useConfig;
