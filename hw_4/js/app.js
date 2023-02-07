function calculateCashback (amount , percent){
	
	const cashback = (amount / 100) * percent;

	return cashback;
}

const exampleAmount = 100;
const examplePercent = 30;
const result = calculateCashback(examplePercent , exampleAmount);

console.log(result);