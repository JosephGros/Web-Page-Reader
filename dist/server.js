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
const puppeteer_1 = __importDefault(require("puppeteer"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)());
app.get('/screenshot', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL is required');
    }
    let browser;
    try {
        browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        yield page.goto(url, { waitUntil: 'networkidle2' });
        const screenshot = yield page.screenshot({ encoding: 'base64' });
        res.set('Content-Type', 'image/png');
        res.send(Buffer.from(screenshot, 'base64'));
    }
    catch (error) {
        res.status(500).send('Error capturing screenshot');
    }
    finally {
        if (browser) {
            yield browser.close();
        }
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
