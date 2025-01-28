// Quantum Tunneling Simulation in JavaScript

// Constants
const hbar = 1.0;  // Reduced Planck's constant (set to 1 for simplicity)
const m = 1.0;     // Mass of the electron (set to 1 for simplicity)
const E = 4.0;     // Energy of the electron
const L = 10.0;    // Length of the domain
const N = 1000;    // Number of grid points
const x = Array.from({ length: N }, (_, i) => i * (L / N));  // Position grid

// Define the potential barrier
function potentialBarrier(x, V0, a, b) {
  return x.map(xi => (xi >= a && xi <= b ? V0 : 0));
}

// Parameters for the potential barrier
const V0 = 3.0;  // Height of the potential barrier
const a = 4.0;   // Start of the barrier
const b = 6.0;   // End of the barrier
const V = potentialBarrier(x, V0, a, b);  // Potential barrier array

// Schrödinger equation solver
function schrodingerEquation(x, psi, E, V) {
  let psiVal = psi[0];
  let psiPrimeVal = psi[1];
  const kSquared = 2 * m * (E - V[Math.floor(x / L * (N - 1))]) / hbar ** 2;
  return [psiPrimeVal, -kSquared * psiVal];
}

// Initial conditions (wavefunction starts as a plane wave)
const psi0 = 1.0;  // Initial value of psi
const psiPrime0 = 1.0j * Math.sqrt(2 * m * E) / hbar;  // Initial derivative of psi (plane wave)

// Numerical integration using the Euler method (simplified solver)
let psi = new Array(N).fill(0);
psi[0] = psi0;
let psiPrime = new Array(N).fill(0);
psiPrime[0] = psiPrime0;

for (let i = 1; i < N; i++) {
  let result = schrodingerEquation(x[i], [psi[i - 1], psiPrime[i - 1]], E, V);
  psi[i] = psi[i - 1] + result[0] * (x[i] - x[i - 1]);
  psiPrime[i] = psiPrime[i - 1] + result[1] * (x[i] - x[i - 1]);
}

// Normalize the wavefunction
const norm = Math.sqrt(psi.reduce((sum, val) => sum + Math.abs(val) ** 2, 0));
for (let i = 0; i < N; i++) {
  psi[i] /= norm;
}

// Plot the results on the canvas
function plotQuantumTunneling() {
  const canvas = document.getElementById("wavefunctionCanvas");
  const ctx = canvas.getContext("2d");

  // Scale and draw the wavefunction
  const scaleFactor = 100;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2 - psi[0] * scaleFactor);
  for (let i = 1; i < N; i++) {
    ctx.lineTo(i * (canvas.width / N), canvas.height / 2 - psi[i] * scaleFactor);
  }
  ctx.strokeStyle = "blue";
  ctx.stroke();

  // Draw the potential barrier
  ctx.beginPath();
  for (let i = 0; i < N; i++) {
    ctx.lineTo(i * (canvas.width / N), canvas.height - V[i] * 40);
  }
  ctx.strokeStyle = "black";
  ctx.stroke();
}

// Call the plot function
plotQuantumTunneling();
