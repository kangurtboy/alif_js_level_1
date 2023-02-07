function calculateCommission(amount, rate) {
  const summ = amount * rate;

  const percent = 0.2;

  const commission = (summ / 100) * percent;

  const min = 250;
  const max = 450;

  if (commission < min) {
    return min;
  }
  if (commission > max) {
    return max;
  }
}

const exampleAmount = 100;
const exampleRate = 10;
const result = calculateCommission(exampleAmount, exampleRate);

console.log(result);