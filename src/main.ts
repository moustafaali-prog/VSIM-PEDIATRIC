import { EndToEndSession } from "./core/EndToEndSession";
import { getOperationalScenario } from "./scenarios/ScenarioPackage";
import { SimulationUI } from "./ui/SimulationUI";

const root = document.querySelector<HTMLDivElement>("#app");
if (!root) throw new Error("Application root not found.");

const scenario = getOperationalScenario("BABYLON-PED-01");
if (!scenario) throw new Error("Default operational scenario is unavailable.");

const session = new EndToEndSession(scenario);
new SimulationUI(root, session).mount();
session.start();
