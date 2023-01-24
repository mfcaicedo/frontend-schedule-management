import React, { useEffect, useRef, useState } from "react";

import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

function Navbar() {

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

    return (

        <Menubar model={items}
            // start={<InputText placeholder="Search" type="text" />}
            end={
                <>
                    {/* <InputText placeholder="Search" type="text" style={{marginRight:"5px"}} /> */}
                    <Button label="Cerrar sesión" icon="pi pi-power-off" />
                </>
            }
        />

    )
}
export default Navbar;
