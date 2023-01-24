import React, { useEffect, useState, useRef } from "react"

import {
    ScheduleComponent,
    Inject,
    Day,
    Week,
    WorkWeek,
    Month,
    Agenda,
    EventSettingsModel,
    DragAndDrop,
    Resize,
} from '@syncfusion/ej2-react-schedule';



function Schedule() {

    //Se declara un estado para guargar los ambientes 
    const [dataAmbients, setDataAmbients] = useState([])
    //Se declara un estado para guargar las competencias
    const [dataCompetences, setDataCompetences] = useState([])
    //Se declara un estado para guargar los docentes
    const [dataTeachers, setDataTeachers] = useState([])

    /**
     * Metodo para cargar los ambientes haciendo la peticion a la API
     */
    const loadAmbients = () => {
        fetch('http://localhost:8080/ambient')
            .then(response => response.json())
            .then(data => {
                setDataAmbients(data)
            })
    }
    /**
     * Metodo para cargar las competencias haciendo la peticion a la API 
     */
    const loadCompetences = () => {
        fetch('http://localhost:8080/competence')
            .then(response => response.json())
            .then(data => {
                setDataCompetences(data)
            })
    }
    /**
     * Metodo para cargar los docentes haciendo la peticion a la API 
     */
    const loadTeachers = () => {
        fetch('http://localhost:8080/teacher')
            .then(response => response.json())
            .then(data => {
                setDataCompetences(data)
            })
    }

    //json de docentes con los atributos siguientes: id, area, identity_card, lastname,name, status, type_id, type ,type_contract
    let jsonDocentes = {
        "teachers": [
            {
                "id": 1,
                "area": "Matemáticas",
                "identity_card": "1234567890",
                "lastname": "Pérez",
                "name": "Juan",
                "status": "Activo",
                "type_id": 1,
                "type": "Técnico",
                "type_contract": "Planta"
            },
            {
                "id": 2,
                "area": "Lenguaje",
                "identity_card": "0987654321",
                "lastname": "Gómez",
                "name": "Maria",
                "status": "Activo",
                "type_id": 2,
                "type": "Profesional",
                "type_contract": "Contratista"
            },
            {
                "id": 3,
                "lastname": "Gómez",
                "name": "Marta",
                "status": "Activo",
                "type_id": 2,
                "type": "Profesional",
                "type_contract": "Planta"
            },
            {
                "id": 4,
                "lastname": "Lopez",
                "name": "Bruno",
                "status": "Activo",
                "type_id": 1,
                "type": "Profesional",
                "type_contract": "Planta"
            },
        ]
    }

    let nombre = "brandon Nicolas"
    let Ambiente = "Salon 221"
    let Competencia = "TDS"


    const data = [
        {
            Id: 1,
            Subject: 'Meeting',
            StartTime: new Date(2023, 0, 23, 10, 0),
            EndTime: new Date(2023, 0, 23, 12, 30),
            IsAllDay: false,
            Status: 'Completed',
            Priority: 'High',
            MeetingType: 'Meeting',
            Location: '',
        },
        {
            Id: 2,
            Subject: 'Meeting 2',
            StartTime: new Date(2023, 0, 23, 10, 0),
            EndTime: new Date(2023, 0, 23, 12, 30),
            IsAllDay: false,
            Status: 'Completed',
            Priority: 'High',
            MeetingType: 'Meeting',
            Location: '',
            IsDeleted: false,
            teacher: "hola a todos",
            Description: `Profesor: ${nombre} \n Ambiente: ${Ambiente}`
        },
    ];
    /**
     * Metodo que se ejecuta cuando se abre el modal para agregar un evento
     * @param {*} args data de la celda
     */
    function onPopupOpen(args) {
        console.log("hola a todos", args);
    }
    /**
     * Metodo que se  ejecuta cuando se cierra el modal al agregar un evento
     * @param {*} args data de la celda
     */
    function onPopupClose(args) {
        console.log("data", args.data);
        console.log("type", args.type);
    }

    //useEffect que hace referencia al ciclo de vida del componente (inicio, actualizacion, fin)
    useEffect(() => {
        loadAmbients()
    }, [])

    return (
        <div className="schedule-header" style={{ marginTop: '20px' }}>
            <ScheduleComponent
                selectedDate={new Date(2023, 0, 1)}
                eventSettings={{ dataSource: data }}
                popupOpen={onPopupOpen}
                popupClose={onPopupClose}

            >
                <Inject services={[Day, Week, Agenda, WorkWeek, Month, DragAndDrop, Resize]}
                />

            </ScheduleComponent>
        </div>
    )
}
export default Schedule; 