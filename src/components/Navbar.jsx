import React, { useEffect, useRef, useState } from "react";
import { supabase } from './login/supabaseClient';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

function Navbar(loading) {

    const [render, setRender] = useState(null);

    const items = [
        {
            label: 'Inicio',
            icon: 'pi pi-fw pi-home',
        },
        {
            label: 'Horario',
            icon: 'pi pi-calendar',
            items: [
                {
                    label: 'Left',
                    icon: 'pi pi-fw pi-align-left',
                    command: () => {
                        window.location = "/schedule"
                    }
                },
            ],

        },
        {
            label: 'Programa',
            icon: 'pi pi-pencil',
            items: [
                {
                    label: 'Competencia',
                    icon: 'pi pi-fw pi-book',
                    command: () => {
                        window.location = "/view-competence"
                    }

                },
                {
                    label: 'Ver',
                    icon: 'pi pi-eye',
                    command: () => {
                        window.location = "/view-program"
                    }

                },
            ]
        },
        {
            label: 'Ambiente',
            icon: 'pi pi-building',
            command: () => {
                window.location = "/view-ambient"
            }
        },
        {
            label: 'Periodo académico',
            icon: 'pi pi-clock',
            command: () => {
                window.location = "/view-academicperiod"
            }
        },
        {
            label: 'Docente',
            icon: 'pi pi-user'
        }
    ];

    useEffect(() => {
        {console.log("loading", loading)}
        if(loading.render === true){
            setRender(true)
        }else{
            setRender(false)
        }
        {console.log("carga", render)}
    }, [loading])
    
    
    return (
        
        <div aria-live="polite" className='container mx-auto'>
            
            {render === true && render !== null ? (
                <Menubar model={items}
                // start={<InputText placeholder="Search" type="text" />}
                    end={
                    <>
                        {/* <InputText placeholder="Search" type="text" style={{marginRight:"5px"}} /> */}
                        <Button label="Cerrar sesión" icon="pi pi-power-off " onClick={() => supabase.auth.signOut()} />
                    </>
                    }
                 />
            ): (

                null
            )}
        </div>
        
        

    )
}
export default Navbar;
