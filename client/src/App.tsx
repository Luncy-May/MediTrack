import { useState, useEffect } from "react";
import axios from "axios";
import './App.css'
interface Patient {
  resourceType: "Patient";
  id: string;
  name?: {
    given?: string[];
    family?: string;
  }[];
  birthDate?: string;
  gender?: string;
}

interface ConditionEntry {
    resource: {
        code?: { text: string };
    };
}

function App() {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [conditions, setConditions] = useState<ConditionEntry[]>([]);

    // const getPatient = async () => {
    //   axios.get("http://localhost:5010/api/patient")
    //         .then(res => setPatient(res.data))
    //         .catch(err => console.error("Error fetching patient", err));
    // }
    // const getConditions = async () => {
    //   axios.get("http://localhost:5010/api/conditions")
    //         .then(res => setConditions(res.data.entry || []))
    //         .catch(err => console.error("Error fetching conditions", err));
    // }
    useEffect(() => {
        axios.get("http://localhost:5010/api/patient")
            .then(res => {
              setPatient(res.data)
              console.log(res.data)
            })
            .catch(err => console.error("Error fetching patient", err));

        axios.get("http://localhost:5010/api/conditions")
            .then(res => setConditions(res.data.entry || []))
            .catch(err => console.error("Error fetching conditions", err));
    }, []);

    const getPatientName = () => {
      if (patient !== null){
        return patient.name?.[0]?.given + " " + patient.name?.[0]?.family
      }
      return "N/A"
    }
    return (
        <div className="mediWord items-start">
            <h1 className="items-center">MediTrack - Patient Overview</h1>

            {patient ? (
                <div>
                    <h2>Patient Details</h2>
                    <p><strong>Name:</strong> {getPatientName()}</p>
                    <p><strong>Gender:</strong> {patient.gender || "Unknown"}</p>
                    <p><strong>Birth Date:</strong> {patient.birthDate || "Unknown"}</p>
                </div>
            ) : (
                <p>Loading patient data...</p>
            )}

            <h2>Conditions</h2>
            {conditions.length > 0 ? (
                <ul>
                    {conditions.map((entry, index) => (
                        <li key={index}>{entry.resource.code?.text || "Unknown Condition"}</li>
                    ))}
                </ul>
            ) : (
                <p>No conditions found.</p>
            )}
        </div>
    );
}

export default App;
