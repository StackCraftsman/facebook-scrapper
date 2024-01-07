
const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const XLSX = require('xlsx');

async function setInputValue(page, selector, value) {
  try {
    await page.waitForSelector(selector);
    await page.click(selector, { clickCount: 3 });
    await page.keyboard.type(value);
  } catch (error) {
    console.error(`Error while setting value for selector '${selector}': ${error}`);
  }
}

const loginAndPost = async (data) => {
  const browser = await puppeteer.launch({
    headless: false, // Run in headless mode
  });

  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  await page.setCacheEnabled(false);

  await page.goto('https://www.facebook.com/marketplace/', { waitUntil: 'domcontentloaded' });

  await page.waitForSelector('#email', { visible: true });

  await page.type('#email', 'yourmail');
  await page.type('#pass', 'yourpas');

  await page.click('#loginbutton');

  await page.waitForTimeout(5000);

  await page.evaluate(() => {
    const button = document.querySelector('.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x6prxxf.xvq8zen.x1s688f.xzsf02u');
    if (button) {
      button.click();
    } else {
      console.error("Element not found");
    }
  });

  await page.goto('https://www.facebook.com/marketplace/create', { waitUntil: 'domcontentloaded' });

  await page.waitForTimeout(5000);

  await page.evaluate(() => {
    const button = document.querySelector('a[href="/marketplace/create/rental/"]');
    if (button) {
      button.click();
    } else {
      console.error("Element not found");
    }
  });

  await page.waitForTimeout(3000);

  await page.evaluate(() => {
    const rentalTypeDropdown = document.querySelector('label[aria-label="Rental type"]');
    if (rentalTypeDropdown) {
      rentalTypeDropdown.click();
    } else {
      console.error("Rental type dropdown not found");
    }
  });

  await page.waitForTimeout(3000);

  await page.evaluate(() => {
    const options = document.querySelectorAll('.x1i10hfl');
    for (const option of options) {
      if (option.innerText.includes("Apartment/condo")) {
        option.click();
        break;
      }
    }
  });

  await page.waitForSelector('.x1i10hfl.xggy1nq.x1s07b3s.x1kdt53j.x1a2a7pz.xjbqb8w.x76ihet.xwmqs3e.x112ta8.xxxdfa6.x9f619.xzsf02u.x1uxerd5.x1fcty0u.x132q4wb.x1a8lsjc.x1pi30zi.x1swvt13.x9desvi.xh8yej3.x15h3p50.x10emqs4[type="text"]', { visible: true });

  await setInputValue(page, '.x1i10hfl.xggy1nq.x1s07b3s.x1kdt53j.x1a2a7pz.xjbqb8w.x76ihet.xwmqs3e.x112ta8.xxxdfa6.x9f619.xzsf02u.x1uxerd5.x1fcty0u.x132q4wb.x1a8lsjc.x1pi30zi.x1swvt13.x9desvi.xh8yej3.x15h3p50.x10emqs4[type="text"]', data['Number of bedrooms']);
  await page.waitForSelector('label[aria-label="Number of bathrooms"] input[type="text"]', { visible: true });

  await setInputValue(page, 'label[aria-label="Number of bathrooms"] input[type="text"]', data['Number of bathrooms']);

  await page.waitForSelector('label[aria-label="Price per month"] input[type="text"]', { visible: true });

  const inputField = await page.$('label[aria-label="Price per month"] input[type="text"]');
  const currentValue = await page.evaluate(input => input.value, inputField);
  const newValue = (parseInt(currentValue) + 3000).toString();

  await inputField.click({ clickCount: 3 });
  await inputField.press('Backspace');
  await page.type('label[aria-label="Price per month"] input[type="text"]', data['Price per month']);

  await page.waitForSelector('label[aria-label="Rental description"] textarea', { visible: true });
  await page.type('label[aria-label="Rental description"] textarea', data['Rental description']);

  await page.waitForSelector('label[aria-label="Rental address"] input[type="text"]', { visible: true });
  const inputFields = await page.$('label[aria-label="Rental address"] input[type="text"]');

  if (inputFields) {
    await inputFields.click();
    await page.keyboard.type(data['Rental address'], { delay: 100 });
  } else {
    console.error("Rental address input field not found");
  }

  await page.waitForSelector('ul[aria-label="10 suggested searches"] li.xh8yej3', { visible: true });
  const firstListItem = await page.$('ul[aria-label="10 suggested searches"] li.xh8yej3');

  if (firstListItem) {
    await firstListItem.click();
  } else {
    console.error("The first list item with class 'xh8yej3' was not found.");
  }

  const imageUrl = data.imageURL;
  const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

  const imageFolder = './images';
  if (!fs.existsSync(imageFolder)) {
    fs.mkdirSync(imageFolder);
  }

  const imageFileName = 'image.jpg';
  const imagePath = `${imageFolder}/${imageFileName}`;
  fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'binary'));

  const inputHandle = await page.$('input[type="file"]');
  if (inputHandle) {
    await inputHandle.uploadFile(imagePath);
  } else {
    console.error('File input element not found.');
  }

  await page.waitForSelector('.x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.xl56j7k.x6s0dn4.xozqiw3.x1q0g3np.xi112ho.x17zwfj4.x585lrc.x1403ito.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.xn6708d.x1ye3gou.xtvsq51.x1fq8qgq', { visible: true });
  const nextButton = await page.$('.x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.xl56j7k.x6s0dn4.xozqiw3.x1q0g3np.xi112ho.x17zwfj4.x585lrc.x1403ito.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.xn6708d.x1ye3gou.xtvsq51.x1fq8qgq');

  if (nextButton) {
    await nextButton.click();
  } else {
    console.error("Next button not found after image upload.");
  }

  await page.waitForSelector('.x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.xl56j7k.x6s0dn4.xozqiw3.x1q0g3np.xi112ho.x17zwfj4.x585lrc.x1403ito.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.xn6708d.x1ye3gou.xtvsq51.x1fq8qgq', { visible: true });
  await new Promise(resolve => setTimeout(resolve, 7000));
  await page.waitForSelector('.x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.xl56j7k.x6s0dn4.xozqiw3.x1q0g3np.xi112ho.x17zwfj4.x585lrc.x1403ito.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.xn6708d.x1ye3gou.xtvsq51.x1fq8qgq');
  const publishButton = await page.$('.x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.xl56j7k.x6s0dn4.xozqiw3.x1q0g3np.xi112ho.x17zwfj4.x585lrc.x1403ito.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.xn6708d.x1ye3gou.xtvsq51.x1fq8qgq');

  if (publishButton) {
    await publishButton.click();
  } else {
    console.error("Publish button not found.");
  }

  await page.waitForTimeout(5000);

  await browser.close();
};

const readExcelData = (excelFilePath) => {
  const workbook = XLSX.readFile(excelFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
};

const excelData = readExcelData('rentals.xlsx'); // Provide the path to your Excel file

(async () => {
  for (const data of excelData) {
    try {
      await loginAndPost(data);
      console.log('Successfully posted your listing!');
    } catch (error) {
      console.error('An error occurred while posting:', error);
    }
  }
})();

