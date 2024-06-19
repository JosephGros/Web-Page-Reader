import express from 'express';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get('/screenshot', async (req, res) => {
  const url = req.query.url as string;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const screenshot: any = await page.screenshot({ encoding: 'base64' });

    res.set('Content-Type', 'image/png');
    res.send(Buffer.from(screenshot, 'base64'));
  } catch (error: any) {
    console.error('Error capturing screenshot:', error);
    res.status(500).send(`Error capturing screenshot: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});