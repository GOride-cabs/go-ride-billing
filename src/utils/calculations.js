export function computeInvoice(invoice) {
  const lineItems = [];
  let baseAmount = 0;

  const model = invoice.billingModel || 'both';

  if (model === 'km') {
    const km = Number(invoice.totalKm) || 0;
    const rate = Number(invoice.ratePerKm) || 0;
    const minKm = Number(invoice.minKm) || 0;
    const billableKm = Math.max(km, minKm);
    const amount = billableKm * rate;
    baseAmount += amount;

    let desc = `Distance Driven: ${billableKm} KM (${invoice.carType || 'Cab'})`;
    if (minKm > 0 && km < minKm) {
      desc += ` [Min. commitment: ${minKm} KM]`;
    }
    lineItems.push({
      id: 'km-fare',
      description: desc,
      qty: `${billableKm} KM`,
      rate: `₹${rate}/KM`,
      amount: amount
    });
  } else if (model === 'hourly') {
    const hrs = Number(invoice.hoursUsed) || 0;
    const rate = Number(invoice.hourlyRate) || 0;
    const amount = hrs * rate;
    baseAmount += amount;

    lineItems.push({
      id: 'hourly-fare',
      description: `Rental Service Duration (${hrs} Hours @ ₹${rate}/Hr)`,
      qty: `${hrs} Hrs`,
      rate: `₹${rate}`,
      amount: amount
    });
  } else if (model === 'package') {
    const pkgBase = Number(invoice.packageBasePrice) || 0;
    baseAmount += pkgBase;
    lineItems.push({
      id: 'package-base',
      description: invoice.packageName || invoice.tripPackageName || 'Trip / Tour Package Fare (Fixed)',
      qty: '1 Trip',
      rate: `₹${pkgBase}`,
      amount: pkgBase
    });

    const extraHrs = Number(invoice.extraHours) || 0;
    const extraHrRate = Number(invoice.extraHourRate) || 0;
    if (extraHrs > 0 && extraHrRate > 0) {
      const extraHrAmount = extraHrs * extraHrRate;
      baseAmount += extraHrAmount;
      lineItems.push({
        id: 'extra-hours',
        description: `Extra Service Hours (${extraHrs} Hrs @ ₹${extraHrRate}/Hr)`,
        qty: `${extraHrs} Hrs`,
        rate: `₹${extraHrRate}`,
        amount: extraHrAmount
      });
    }

    const extraKm = Number(invoice.extraKm) || 0;
    const extraKmRate = Number(invoice.extraKmRate) || 0;
    if (extraKm > 0 && extraKmRate > 0) {
      const extraKmAmount = extraKm * extraKmRate;
      baseAmount += extraKmAmount;
      lineItems.push({
        id: 'extra-km',
        description: `Extra Distance Exceeded (${extraKm} KM @ ₹${extraKmRate}/KM)`,
        qty: `${extraKm} KM`,
        rate: `₹${extraKmRate}`,
        amount: extraKmAmount
      });
    }
  } else {
    // 'both' / Hybrid: KM Fare + Hours Used / Extra Hours
    const km = Number(invoice.totalKm) || 0;
    const kmRate = Number(invoice.ratePerKm) || 0;
    const kmAmount = km * kmRate;
    baseAmount += kmAmount;

    lineItems.push({
      id: 'km-base',
      description: `Distance Driven: ${km} KM (${invoice.carType || 'Cab'})`,
      qty: `${km} KM`,
      rate: `₹${kmRate}/KM`,
      amount: kmAmount
    });

    const hrs = Number(invoice.hoursUsed) || 0;
    const hrRate = Number(invoice.hourlyRate) || 0;
    if (hrs > 0 && hrRate > 0) {
      const hrAmount = hrs * hrRate;
      baseAmount += hrAmount;
      lineItems.push({
        id: 'hr-charge',
        description: `Cab Usage Duration (${hrs} Hours)`,
        qty: `${hrs} Hrs`,
        rate: `₹${hrRate}/Hr`,
        amount: hrAmount
      });
    }
  }

  // Add Toll charges if any
  const toll = Number(invoice.tollCharges) || 0;
  if (toll > 0) {
    lineItems.push({
      id: 'toll',
      description: 'Toll Gate / Alipiri Ghat Entry Toll Fees',
      qty: 'Actuals',
      rate: `₹${toll}`,
      amount: toll
    });
  }

  // Add Parking charges if any
  const parking = Number(invoice.parkingCharges) || 0;
  if (parking > 0) {
    lineItems.push({
      id: 'parking',
      description: 'Parking Fees (Tirumala / Railway Station / Airport)',
      qty: 'Actuals',
      rate: `₹${parking}`,
      amount: parking
    });
  }

  // Add Driver Allowance / Batta (Fixed ₹300 / Day standard tariff)
  const batta = Number(invoice.driverAllowance) || 0;
  if (batta > 0) {
    const isMultipleOf300 = batta % 300 === 0;
    const days = isMultipleOf300 ? batta / 300 : 1;
    lineItems.push({
      id: 'driver-batta',
      description: 'Driver Batta / Daily Allowance (Fixed ₹300/Day)',
      qty: isMultipleOf300 ? `${days} Day${days > 1 ? 's' : ''}` : '1 Day',
      rate: isMultipleOf300 ? '₹300 / Day' : `₹${batta}`,
      amount: batta
    });
  }

  // Add Night Halt
  const nightHalt = Number(invoice.nightHaltCharges) || 0;
  if (nightHalt > 0) {
    lineItems.push({
      id: 'night-halt',
      description: 'Night Halt / Late Night Travel Allowance',
      qty: '1 Night',
      rate: `₹${nightHalt}`,
      amount: nightHalt
    });
  }

  // Add Other charges
  const other = Number(invoice.otherCharges) || 0;
  if (other > 0) {
    lineItems.push({
      id: 'other',
      description: invoice.otherChargesDesc || 'Miscellaneous / State Border Tax',
      qty: '1',
      rate: `₹${other}`,
      amount: other
    });
  }

  // Calculate Subtotal
  const subtotal = lineItems.reduce((acc, item) => acc + item.amount, 0);

  // Discount
  const discount = Math.min(Number(invoice.discount) || 0, subtotal);
  const afterDiscount = Math.max(0, subtotal - discount);

  // Taxes
  let gstAmount = 0;
  let cgst = 0;
  let sgst = 0;
  if (invoice.enableGst) {
    const gstRate = Number(invoice.gstRate) || 5;
    gstAmount = Math.round((afterDiscount * gstRate) / 100);
    cgst = gstAmount / 2;
    sgst = gstAmount / 2;
  }

  const grandTotal = Math.round(afterDiscount + gstAmount);
  const advance = Number(invoice.advancePaid) || 0;
  const balanceDue = Math.max(0, grandTotal - advance);

  return {
    lineItems,
    subtotal,
    discount,
    afterDiscount,
    gstRate: invoice.enableGst ? Number(invoice.gstRate) || 5 : 0,
    gstAmount,
    cgst,
    sgst,
    grandTotal,
    advancePaid: advance,
    balanceDue
  };
}
