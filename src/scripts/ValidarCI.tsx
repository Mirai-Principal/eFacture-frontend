function ValidarCI(CI: string): boolean {
  let dig: number,
    aux: number,
    par = 0,
    mult: number,
    imp = 0,
    Suma: number,
    div: number,
    da: number;

  for (let i = 0; i < 9; i++) {
    aux = i + 1;

    if (aux % 2 === 0) {
      dig = parseInt(CI.charAt(i), 10);
      par += dig;
    } else {
      dig = parseInt(CI.charAt(i), 10);
      mult = dig * 2;
      if (mult > 9) {
        mult -= 9;
      }
      imp += mult;
    }
  }

  da = parseInt(CI.charAt(9), 10);
  Suma = par + imp;
  div = Suma % 10;

  if (div !== 0) {
    div = 10 - div;
  }

  return div === da;
}

export default ValidarCI;
