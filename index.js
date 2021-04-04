function calculate(event) {
  event.preventDefault();
  const cost = document.getElementById('cost');
  const requiredMessage = document.getElementById('required-message');
  const invalidMessage = document.getElementById('invalid-message');

  if (cost.value === '') {
    requiredMessage.style.display = 'block';
    return
  } 
  if (cost.value <= 0) {
    invalidMessage.style.display = 'block';
    return
  } 
  requiredMessage.style.display = 'none';
  invalidMessage.style.display = 'none';

  const defaultMarkup = document.getElementById('default-markup');
  const taxRate = document.getElementById('tax-rate');

  const rawPrice = cost.value / (1 - (defaultMarkup.value / 100));
  const rawPriceWithTax = taxRate.value ? rawPrice + (rawPrice * (taxRate.value / 100)) : rawPrice;
  const rawPriceWithoutTax = roundingRule(rawPriceWithTax / (1 + taxRate.value / 100));
  const grossProfitInPercent = ((rawPriceWithoutTax - cost.value) / rawPriceWithoutTax * 100);
  const grossProfitInDollar = rawPriceWithoutTax - cost.value;

  const data = {
    rawPrice,
    rawPriceWithTax,
    grossProfitInPercent,
    grossProfitInDollar
  };

  updateTableData(data);
}

function roundingRule(cost) {

  const roundingRule = document.getElementById('rounding-rule');
  const floatPart = Number((cost - Math.trunc(cost)).toFixed(2));

  if (roundingRule.value === '99') {
    if ((floatPart * 100) > 50) {
      return Math.ceil(cost) - 0.01;
    }
     else {
       return Math.floor(cost) - 0.01;
     }
  } else if (roundingRule.value === '00') {
    if ((floatPart * 100) > 40) {
      return Math.ceil(cost);
    }
     else {
       return Math.floor(cost);
     }
  } else if (roundingRule.value === '' || roundingRule.value === '95') {
    if ((floatPart * 100) > 45) {
      return Math.ceil(cost) - 0.05;
    }
     else {
       return Math.floor(cost) - 0.05;
     }
  }
}

function updateTableData(data) {

  const taxInclusivePrice = document.querySelector('[data-tax-inclusive-price]');
  const taxExclusivePrice = document.querySelector('[data-tax-exclusive-price]');
  const grossProfitInPercent = document.querySelector('[data-gross-profit-in-percent]');
  const grossProfitInDollar = document.querySelector('[data-gross-profit-in-dollar]');
  const pricingMode = document.getElementById('pricing-mode');

  if (pricingMode.value === 'tax-exclusive-price') {
    taxExclusivePrice.innerHTML = roundingRule(data.rawPrice).toFixed(2);
    taxInclusivePrice.innerHTML = data.rawPriceWithTax.toFixed(2);
  } else {
    taxExclusivePrice.innerHTML = data.rawPrice.toFixed(2);
    taxInclusivePrice.innerHTML = roundingRule(data.rawPriceWithTax).toFixed(2);
  } grossProfitInPercent.innerHTML = data.grossProfitInPercent.toFixed(2);
  grossProfitInDollar.innerHTML = data.grossProfitInDollar.toFixed(2);
}
