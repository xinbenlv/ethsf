#!/usr/bin/env node

const wc = require("./witness_calculator.js");
const {readFileSync, writeFileSync, writeFile} = require("fs");
const {plonk} = require("snarkjs");
const path = require("path");

let WASM_PATH = path.join(__dirname, "./mimcsponge.wasm");
let ZKEY_PATH = path.join(__dirname, "./mimcsponge.zkey");
let WTNS_PATH = path.join(__dirname, "./mimcsponge.wtns");

function calulateWitness(potentialSolution, userId) {
    let input = {
        "in": potentialSolution,
        "user_id_in": userId
    };
    const buffer = readFileSync(WASM_PATH);
    return wc(buffer).then(async witnessCalculator => {
        // const w = await witnessCalculator.calculateWitness(input, 0);
        // for (let i = 0; i < w.length; i++) {
        //     console.log(w[i]);
        // }
        const buff = await witnessCalculator.calculateWTNSBin(input, 0);
        writeFileSync(WTNS_PATH, buff, function (err) {
            if (err) throw err;
        });
    });
}

async function computeProof(solution, playerId) {
    await calulateWitness(solution, playerId);
    var data = await plonk.prove(ZKEY_PATH, WTNS_PATH)
    return plonk.exportSolidityCallData(data.proof, data.publicSignals);
}

let main = async (solution, userId) => {
    let data = await computeProof(solution, userId);
    console.log(data);
}

// node zkp.js 18 2
if (process.argv.length != 4) {
    console.log("Usage: node zkp.js <puzzle-solution> <user-id>");
    process.exit(1);
} else {
    main(process.argv[2], process.argv[3]).then(() => {
        process.exit(0);
    });
}
