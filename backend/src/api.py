# backend/src/api.py
from fastapi import FastAPI, Request
from simulation.monte_carlo_simulation import RaceConfig, run_race_scenarios, analyze_results

app = FastAPI()

@app.post("/api/simulate")
async def simulate(request: Request):
    body = await request.json()
    config = RaceConfig(**body)
    results = run_race_scenarios(config, n_scenarios=body.get("n_scenarios", 1000))
    analysis = analyze_results(results)
    return analysis
