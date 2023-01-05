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
                    items: [
                        {
                            label: 'Crear',
                            icon: 'pi pi-plus-circle', 
                            command: () => {
                                window.location = "/competence"
                            }
                        }, 
                        {
                            label: 'Ver',
                            icon: 'pi pi-eye', 
                            command: () => {
                                window.location = "/view-competence"
                            }
                        }, 
                    ]
        
                }, 
                {
                    label: 'Crear',
                    icon: 'pi pi-fw pi-user-plus',

                },
                {
                    label: 'Ver',
                    icon: 'pi pi-eye',

                },
                {
                    label: 'Search',
                    icon: 'pi pi-fw pi-users',
                    items: [
                        {
                            label: 'Filter',
                            icon: 'pi pi-fw pi-filter',
                            items: [
                                {
                                    label: 'Print',
                                    icon: 'pi pi-fw pi-print'
                                }
                            ]
                        },
                        {
                            icon: 'pi pi-fw pi-bars',
                            label: 'List'
                        }
                    ]
                }
            ]
        },
        {
            label: 'Ambiente',
            icon: 'pi pi-building',
            items: [
                {
                    label: 'Edit',
                    icon: 'pi pi-fw pi-pencil',
                    items: [
                        {
                            label: 'Save',
                            icon: 'pi pi-fw pi-calendar-plus'
                        },
                        {
                            label: 'Delete',
                            icon: 'pi pi-fw pi-calendar-minus'
                        },

                    ]
                },
                {
                    label: 'Competencia',
                    icon: 'pi pi-fw pi-calendar-times',
                    items: [
                        {
                            label: 'Remove',
                            icon: 'pi pi-fw pi-calendar-minus'
                        }
                    ]
                }, 
                {
                    label: 'Periodo',
                    icon: 'pi pi-fw pi-calendar-times',
                    items: [
                        {
                            label: 'Remove',
                            icon: 'pi pi-fw pi-calendar-minus'
                        }
                    ]
                }
            ]
        },
        {
            label: 'Periodo académico',
            icon: 'pi pi-clock',
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
