// ZKP SNARK proof helper function

const wc = require("./witness_calculator.js");
const {readFileSync, writeFileSync} = require("fs");
const {plonk} = require("snarkjs");
const { mainModule } = require("process");

let WASM_PATH = "./mimcsponge.wasm"
let ZKEY_PATH = "./mimcsponge.zkey"
let WTNS_PATH = "./mimcsponge.wtns"

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

let main = async () => {
    let data = await computeProof(18, 4);
    console.log(data);
}

main().then(()=> {
    console.log(`Done!`)
    process.exit(0);
});
