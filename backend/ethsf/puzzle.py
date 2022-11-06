import subprocess
from pathlib import Path

FILE_PATH = Path(__file__).parent.resolve()
ZKP_PATH = (FILE_PATH / "../../zkp/zkp.js").resolve()


def get_puzzle_proof(solution, player_id):
    proc = subprocess.run([str(ZKP_PATH), str(solution), str(player_id)], capture_output=True)
    output = proc.stdout.decode()
    proof, public = output.split(",", 1)
    public = public.replace("[", "").replace("]", "").replace("\"", "").replace("\n", "").split(",")

    return {
        "proof": proof,
        "public": public
    }
