require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const FHIR_SERVER = "https://r4.smarthealthit.org"; // Public SMART FHIR Sandbox

// Fetch the first available patient dynamically
app.get("/api/patient", async (req, res) => {
    try {
        const patientList = await axios.get(`${FHIR_SERVER}/Patient?_count=1`);
        if (!patientList.data || !patientList.data.entry || patientList.data.entry.length === 0) {
            return res.status(404).json({ error: "No patients found in the test server" });
        }
        const patient = patientList.data.entry[0].resource;
        res.json(patient);
    } catch (error) {
        console.error("Error fetching patient:", error.message);
        res.status(500).json({ error: "Failed to fetch patient" });
    }
});

// Fetch conditions for the first available patient
app.get("/api/conditions", async (req, res) => {
    try {
        const patientList = await axios.get(`${FHIR_SERVER}/Patient?_count=1`);
        if (!patientList.data || !patientList.data.entry || patientList.data.entry.length === 0) {
            return res.status(404).json({ error: "No patients found in the test server" });
        }
        const patientId = patientList.data.entry[0].resource.id;

        const response = await axios.get(`${FHIR_SERVER}/Condition?patient=${patientId}`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching conditions:", error.message);
        res.status(500).json({ error: "Failed to fetch conditions" });
    }
});

// Start the server
const PORT = 5010;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

// // ================== TESTING WITH FHIR.js ==================
// var mkFhir = require('fhir.js');

// var client = mkFhir({
//     baseUrl: 'https://r4.smarthealthit.org'
// });

// // Fetch patients born in 1974
// client
//     .search({ type: "Patient", query: { birthdate: "1974" } })
//     .then(function (res) {
//         var bundle = res.data;
//         var count = (bundle.entry && bundle.entry.length) || 0;
//         console.log("# Patients born in 1974: ", count);
//     })
//     .catch(function (res) {
//         if (res.status) console.log("Error", res.status);
//         if (res.message) console.log("Error", res.message);
//     });
