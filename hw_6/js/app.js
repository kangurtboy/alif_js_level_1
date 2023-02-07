function calculateCommission(amount, total) {
  const summ = total + amount;
  const maxAmount = 5000;
  const minAmount = 0.35;
  const noCommission = 0;
  const percent = 0.7;
  const commission = ((summ - maxAmount) / 100) * percent;
  if (summ < maxAmount) {
    return noCommission;
  }

  if (commission < minAmount) {
    return minAmount;
  }

  return commission;
}

const exampleAmount = 2000;
const exampletotal = 3000;
const result = calculateCommission(exampleAmount, exampletotal);

console.log(result);