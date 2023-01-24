import './App.css';
import PublicRouters from './routers/PublicRouters';
//import {useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { supabase } from './components/login/supabaseClient';
import Account from './components/login/Account';
import Auth from './components/login/Auth';
import CompetenceForm from "./components/CompetenceForm";
import DashboardCompetence from "./components/competence/DashboardCompetence";
import DashboardAmbient from "./components/ambient/DashboardAmbient";
import DashboardAcademicPeriod from "./components/AcademicPeriod/DashboardAcademicPeriod";
import DashboardProgram from "./components/program/DashboardProgram";
// import { Routes, Route} from "react-router-dom";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  //const navigate = useNavigate();
  const [session, setSession] = useState(null)



  useEffect(() => {
    setSession(supabase.auth.getSession())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (_event == 'SIGNED_OUT') {
        window.location.href = "/";
      }
      if (!session) {
        //navigate("/login");
        console.log("entraaaaaaaaaaaaaaaaaaaaaaa")
        //window.location.href="/";
      } else {
        console.log("elseeeeeeeeeeeeee")
        window.location.href = "/account";
      }
    });
  }, [])

  /*
    const getSession = async () =>{
      try{
        const dataSession = await supabase.auth.getUser()
        console.log(dataSession.id);
        return dataSession;
    }catch(error){
        alert(error.message)
    }
    }
    let sessionPrueba = getSession();
    */
  return (


    <div className="App">
      <BrowserRouter>
        {/* <PublicRouters /> */}
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/account" element={<Account />} />
          <Route path="/competence" element={<CompetenceForm />} />
          <Route path="/view-competence/" element={<DashboardCompetence />} />
          <Route path="/view-ambient/" element={<DashboardAmbient />} />
          <Route path="/view-academicperiod/" element={<DashboardAcademicPeriod />} />
          <Route path="/view-program/" element={<DashboardProgram />} />
        </Routes>
      </BrowserRouter>

    </div>

    // <div className="container mx-auto">
    //{/* {console.log("veeer",session)} */}
    // {session == null ? <Auth /> : <Account key={null} session={session} />}
    // </div>
  );
}

export default App;
