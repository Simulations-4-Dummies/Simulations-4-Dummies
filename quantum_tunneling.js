<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Quantum Tunneling Simulation</title>
    <style>
        body {
            font-family: Poppins, sans-serif;
            margin: 2;
            padding: 0;
            background-color: #608da2;
        }
        h1 {
            text-align: center;
        }
        #simulation-container {
            width: 80%;
            margin: 0 auto;
        }
        canvas {
            display: block;
            margin: 20px auto;
            border: 1px solid black;
        }
        .controls {
            text-align: center;
            margin-bottom: 20px;
        }
        .slider-container {
            margin: 10px;
        }
    </style>
</head>
<body>
   <h1>Quantum Tunneling Simulation</h1>
    <h2>Welcome to My Quantum Tunneling Simulation</h2>
    <p>This project simulates quantum tunneling and an electron's wave function using Schrödinger's equation.</p>
    
    <h2>What is Quantum Tunneling?</h2>
    <p>Quantum tunneling is a phenomenon where particles, like electrons, pass through a barrier, even if they don’t have enough energy to overcome it.</p>
    <p>This happens due to the wave-like nature of particles in quantum mechanics.</p>

    <h2>Try the Simulation!</h2>
    <p>The simulation uses Schrödinger's equation to calculate the behavior of an electron interacting with a potential barrier.</p>
    <p>Check out the interactive graph below:</p>


    <div class="controls">
        <div class="slider-container">
            <label for="energy-slider">Energy (E):</label>
            <input id="energy-slider" type="range" min="0" max="10" value="4" step="0.1">
            <span id="energy-value">4.0</span>
        </div>

        <div class="slider-container">
            <label for="barrier-height-slider">Barrier Height (V₀):</label>
            <input id="barrier-height-slider" type="range" min="0" max="10" value="3" step="0.1">
            <span id="barrier-height-value">3.0</span>
        </div>

        <div class="slider-container">
            <label for="barrier-start-slider">Barrier Start (a):</label>
            <input id="barrier-start-slider" type="range" min="0" max="10" value="4" step="0.1">
            <span id="barrier-start-value">4.0</span>
        </div>

        <div class="slider-container">
            <label for="barrier-end-slider">Barrier End (b):</label>
            <input id="barrier-end-slider" type="range" min="0" max="10" value="6" step="0.1">
            <span id="barrier-end-value">6.0</span>
      </div>
        
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/plotly.js-dist@2.11.1/plotly.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dat.gui@0.7.6/build/dat.gui.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/numeric@1.2.6/numeric.min.js"></script>
    <div id="plot"></div>
    
    <script>
        // Constants
        const hbar = 1.0;
        const m = 1.0;
        const L = 10.0;
        const N = 1000;
        const x = numeric.linspace(0, L, N);

        // Potential Barrier Function
        function potentialBarrier(x, V0, a, b) {
            return x.map(val => (val >= a && val <= b) ? V0 : 0);
        }

        // Schrödinger Equation
        function schrodingerEquation(x, psi, E, V) {
            const psi_val = psi[0];
            const psi_prime_val = psi[1];
            const k_squared = 2 * m * (E - V[Math.floor(x / L * (N - 1))]) / hbar ** 2;
            return [psi_prime_val, -k_squared * psi_val];
        }

        // Quantum Tunneling Simulation
        function quantumTunnelingSimulation(V0, a, b, E) {
            const V = potentialBarrier(x, V0, a, b);

            // Initial conditions
            const psi0 = 1.0;
            const psi_prime0 = 1.0j * Math.sqrt(2 * m * E) / hbar;

            // Solving Schrödinger equation using numeric.js' ODE solver
            const solution = numeric.dopri(0, L, [psi0, psi_prime0], function(t, psi) {
                return schrodingerEquation(t, psi, E, V);
            });

            const psi = solution[1];
            const normPsi = numeric.div(psi, Math.sqrt(numeric.trapz(numeric.pow(numeric.abs(psi), 2), x)));

            // Plotting the results using Plotly
            const trace1 = {
                x: x,
                y: V,
                type: 'scatter',
                mode: 'lines',
                name: 'Potential Barrier',
                line: { color: 'black', width: 2 }
            };
            const trace2 = {
                x: x,
                y: numeric.real(normPsi),
                type: 'scatter',
                mode: 'lines',
                name: 'Real(ψ)',
                line: { color: 'blue', width: 2 }
            };
            const trace3 = {
                x: x,
                y: numeric.pow(numeric.abs(normPsi), 2),
                type: 'scatter',
                mode: 'lines',
                name: '|ψ|² (Probability Density)',
                line: { color: 'red', width: 2 }
            };

            const layout = {
                title: 'Quantum Tunneling: Wavefunction and Probability Density',
                xaxis: { title: 'Position (x)' },
                yaxis: { title: 'Wavefunction / Potential' },
                showlegend: true,
                grid: { visible: true },
                shapes: [{
                    type: 'rect',
                    x0: a,
                    x1: b,
                    y0: 0,
                    y1: Math.max(...V),
                    fillcolor: 'gray',
                    opacity: 0.3,
                    line: { width: 0 },
                    name: 'Barrier Region'
                }]
            };

            const data = [trace1, trace2, trace3];
            Plotly.newPlot('plot', data, layout);
        }

        // GUI controls for interactive parameters
        const gui = new dat.GUI();
        const params = {
            V0: 1.0,
            a: 0.0,
            b: 5.0,
            E: 0.5
        };
        gui.add(params, 'V0', 1.0, 10.0, 0.5).onChange(() => quantumTunnelingSimulation(params.V0, params.a, params.b, params.E));
        gui.add(params, 'a', 0.0, 5.0, 0.5).onChange(() => quantumTunnelingSimulation(params.V0, params.a, params.b, params.E));
        gui.add(params, 'b', 5.0, 10.0, 0.5).onChange(() => quantumTunnelingSimulation(params.V0, params.a, params.b, params.E));
        gui.add(params, 'E', 0.5, 10.0, 0.5).onChange(() => quantumTunnelingSimulation(params.V0, params.a, params.b, params.E));

        // Initial simulation
        quantumTunnelingSimulation(params.V0, params.a, params.b, params.E);
    </script>
</body>
</html>
