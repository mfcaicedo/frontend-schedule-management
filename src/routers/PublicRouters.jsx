import React from "react";
import { Routes, Route } from 'react-router-dom';
import Navbar from "../components/Navbar";
import CompetenceForm from "../components/CompetenceForm";
import DashboardCompetence from "../components/competence/DashboardCompetence";
import DashboardAmbient from "../components/ambient/DashboardAmbient";
import DashboardAcademicPeriod from "../components/AcademicPeriod/DashboardAcademicPeriod";
import DashboardProgram from "../components/program/DashboardProgram";
import '../App.css';

function PublicRouters() {

    return (
        <>
            <Navbar />
            <Routes>
                {/* <Route path="/" element={<Navbar />} /> */}
                <Route path="/competence" element={<CompetenceForm />} />
                <Route path="/view-competence/" element={<DashboardCompetence />} />
                <Route path="/view-ambient/" element={<DashboardAmbient />} />
                <Route path="/view-academicPeriod/" element={<DashboardAcademicPeriod />} />
                <Route path="/view-program/" element={<DashboardProgram />} />
            </Routes>
        </>
    )
}
export default PublicRouters;