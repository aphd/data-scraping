const Crawler = require("crawler");
const fs = require("fs");
const { addresses, blockExplorer } = require("./config");

const writeFileCallback = (err, _) => console.log(err);

const getData = ({ $ }) => ({
    code: $("#editor").text(),
    bytecode: $("#verifiedbytecode2").text(),
    abi: $("#js-copytextarea2").text(),
});

const crawlerCallback = (error, res, done) => {
    const address = res.options.uri.match(/address\/(.*?)#code/)[1];
    const fName = `data/${address}`;
    try {
        const data = getData(res);
        fs.writeFile(`${fName}.sol`, data.code, writeFileCallback);
        fs.writeFile(`${fName}.bytecode`, data.bytecode, writeFileCallback);
        fs.writeFile(`${fName}.abi`, data.abi, writeFileCallback);
    } catch (err) {
        console.log("Crawler error", error, err);
    }
    done();
};

const crawler = new Crawler({
    maxConnections: 10,
    callback: crawlerCallback,
});

addresses.forEach((e) => crawler.queue(blockExplorer(e)));
