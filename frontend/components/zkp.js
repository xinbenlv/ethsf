// ZKP SNARK proof helper function

const wc = require("./witness_calculator.js");
const {readFileSync, writeFileSync} = require("fs");
const { plonk } = require("snarkjs");

let WASM_PATH = "./mimcsponge.wasm"
let ZKEY_PATH = "./mimcsponge.zkey"
let WTNS_PATH = "./mimcsponge.wtns"

function calulateWitness(potentialSolution, userId) {
    let input = {
        "in": potentialSolution,
        "user_id_in": userId
    };
    const buffer = readFileSync(WASM_PATH);
    wc(buffer).then(async witnessCalculator => {
        // const w = await witnessCalculator.calculateWitness(input, 0);
        // for (let i = 0; i < w.length; i++) {
        //     console.log(w[i]);
        // }
        const buff = await witnessCalculator.calculateWTNSBin(input, 0);
        writeFileSync(WTNS_PATH, buff, function(err) {
            if (err) throw err;
        });
    });
}

async function computeProof(solution, playerId) {
    calulateWitness(solution, playerId);
    return plonk.prove(ZKEY_PATH, WTNS_PATH).then(data => {
        return plonk.exportSolidityCallData(data.proof, data.publicSignals);
    });
}

// computeProof(18, 2).then(data => {
//     console.log(data)
// });
