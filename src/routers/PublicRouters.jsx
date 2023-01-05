import React from "react";
import { Routes, Route } from 'react-router-dom';
import Navbar from "../components/Navbar";
import CompetenceForm from "../components/CompetenceForm";
import DashboardCompetence from "../components/competence/DashboardCompetence";
import '../App.css';

function PublicRouters() {

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navbar />} />
                <Route path="/competence" element={<CompetenceForm />} />
                <Route path="/view-competence/" element={<DashboardCompetence />} />
            </Routes>
        </>
    )
}
export default PublicRouters;