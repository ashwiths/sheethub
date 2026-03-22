const puppeteer = require("puppeteer");

exports.htmlToPdf = async (req, res) => {
  try {
    console.log("HTML TO PDF API HIT");

    const { html, url } = req.body;

    if (!html && !url) {
      return res.status(400).json({ error: "Provide either HTML or URL" });
    }

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    if (url) {
      await page.goto(url, {
        waitUntil: "networkidle0",
      });
    } else {
      await page.setContent(html, {
        waitUntil: "networkidle0",
      });
    }

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=converted.pdf");

    res.send(pdfBuffer);

  } catch (error) {
    console.error("HTML TO PDF ERROR:", error);
    res.status(500).json({
      error: "Conversion failed",
      message: error.message,
    });
  }
};
