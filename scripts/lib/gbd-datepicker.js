// Reliable date-setting for GBD's bootstrap-datepicker fields (post_start_date,
// post_expire_date). Plain page.fill() is unreliable for post_start_date: the
// widget auto-fills today's date on focus, and .fill() races against that,
// sometimes leaving today's date in place instead of the intended one. Driving
// the calendar UI directly (click field, navigate months, click the day cell)
// avoids the race.

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

async function setDatepickerDate(page, inputSelector, mmddyyyy) {
  const [mm, dd, yyyy] = mmddyyyy.split("/").map(Number);

  await page.locator(inputSelector).click();
  await page.waitForSelector(".datepicker-days", { timeout: 5000 });

  const label = await page.locator(".datepicker-days .picker-switch").first().textContent();
  const [monthName, yearStr] = label.trim().split(" ");
  const currentMonth = MONTHS.indexOf(monthName) + 1;
  const currentYear = parseInt(yearStr, 10);

  const diffMonths = (yyyy - currentYear) * 12 + (mm - currentMonth);
  const arrow = diffMonths > 0 ? ".datepicker-days .next" : ".datepicker-days .previous";
  for (let i = 0; i < Math.abs(diffMonths); i++) {
    await page.locator(arrow).click();
    await page.waitForTimeout(150);
  }

  await page.locator(`.datepicker-days td[data-day="${mmddyyyy}"]`).click();
  await page.waitForTimeout(150);

  const actual = await page.locator(inputSelector).inputValue();
  if (actual !== mmddyyyy) {
    throw new Error(`Datepicker set failed for ${inputSelector}: expected ${mmddyyyy}, got "${actual}"`);
  }
}

module.exports = { setDatepickerDate };
