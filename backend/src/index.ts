import express, { Request, Response } from "express";
import cors from "cors"
// import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const app = express()

app.use(cors())


app.get("/scrapper", async (req:Request, res:Response)=>{
    try {
        const url = req.query.url as string
        const type = req.query.type as string
        console.log(req.query);

        
        let scrapedData:any = ""
        
        const browser = await puppeteer.launch({
            // To run this on vercel
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            // headless: chromium.headless,
          });
        const page = await browser.newPage()

        await page.goto(url, {waitUntil: "domcontentloaded"})

        switch (type) {
            case "title": scrapedData = [await page.evaluate(()=>document.title)]
                break;
                case "meta_description": await page.evaluate(() =>
                    document.querySelector('meta[name="description"]')?.getAttribute("content") || "No Meta Description"
                )
                break;
            case "h1": scrapedData = [await page.evaluate(()=>
                document.querySelector("h1")?.textContent?.trim() || "No h1 element"
            )]
            break;

            case "h2":
                scrapedData = await page.evaluate(() => 
                    Array.from(document.querySelectorAll("h2")).map(el => el.textContent?.trim() || "")
                );
                break;
            case "paragraphs":
                scrapedData = await page.evaluate(() => 
                    Array.from(document.querySelectorAll("p")).map(el => el.textContent?.trim() || "")
                );
                break;

                case "links":
                    scrapedData = await page.evaluate(() =>
                        Array.from(document.querySelectorAll("a"))
                            .map(el => el.getAttribute("href"))
                            .filter(link => link) // Remove null/undefined values
                    );
                    break;

        
                default:
                    scrapedData = "Invalid data type";
                break;
        }

        // const data: string = await page.evaluate(()=>document.title)

        console.log(scrapedData);
        

        await browser.close()

    res.json({scrapedData})
    } catch (error) {
        res.json(error)
    }
})

app.listen(5000, () => console.log("Server running on port 5000"));