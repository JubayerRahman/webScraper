"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// import puppeteer from "puppeteer";
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get("/scrapper", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = req.query.url;
        const type = req.query.type;
        console.log(req.query);
        let scrapedData = "";
        const browser = yield puppeteer_core_1.default.launch({
            // To run this on vercel
            args: chromium_1.default.args,
            executablePath: yield chromium_1.default.executablePath(),
            // headless: chromium.headless,
        });
        const page = yield browser.newPage();
        yield page.goto(url, { waitUntil: "domcontentloaded" });
        switch (type) {
            case "title":
                scrapedData = [yield page.evaluate(() => document.title)];
                break;
            case "meta_description":
                yield page.evaluate(() => { var _a; return ((_a = document.querySelector('meta[name="description"]')) === null || _a === void 0 ? void 0 : _a.getAttribute("content")) || "No Meta Description"; });
                break;
            case "h1":
                scrapedData = [yield page.evaluate(() => { var _a, _b; return ((_b = (_a = document.querySelector("h1")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "No h1 element"; })];
                break;
            case "h2":
                scrapedData = yield page.evaluate(() => Array.from(document.querySelectorAll("h2")).map(el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; }));
                break;
            case "paragraphs":
                scrapedData = yield page.evaluate(() => Array.from(document.querySelectorAll("p")).map(el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; }));
                break;
            case "links":
                scrapedData = yield page.evaluate(() => Array.from(document.querySelectorAll("a"))
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
        yield browser.close();
        res.json({ scrapedData });
    }
    catch (error) {
        res.json(error);
    }
}));
app.listen(5000, () => console.log("Server running on port 5000"));
