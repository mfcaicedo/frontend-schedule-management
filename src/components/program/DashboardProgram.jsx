import React, { useEffect, useRef, useState } from "react";
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import logo from '../../assets/img/logo.png';
import '../../App.css';

import axios from "axios";

function DashboardProgram() {

    const [programs, setPrograms] = useState(null);
    const [programDialog, setProgramDialog] = useState(false);
    const [deleteProgramDialog, setDeleteProgramDialog] = useState(false);
    const [deleteProgramsDialog, setDeleteProgramsDialog] = useState(false);
    const [program, setProgram] = useState([]);
    const [selectedPrograms, setSelectedPrograms] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectAcademicPeriod, setSelectAcademicPeriod] = useState(null);
    const [academicPeriod, setAcademicPeriod] = useState([]);
    const [academicPeriodOptions, setAcademicPeriodOptions] = useState(null);

    //Referencias 
    const toast = useRef(null);
    const dt = useRef(null);

    const loadProgram = () => {
        let baseUrl = "http://localhost:8080/program";
        axios.get(baseUrl).then(response =>
            setPrograms(
                response.data.map((program) => {
                    return {
                        id: program.id,
                        code: program.code,
                        name: program.name,
                        academic_period_id: program.academic_period_id
                    }
                })
            )
        );
    };

    const loadAcademicPeriod = () => {
        let baseUrl = "http://localhost:8080/academicPeriod";
        let arrayData = [];
        axios.get(baseUrl).then(response => {
            setAcademicPeriod(response.data)
            arrayData = response.data
            setAcademicPeriodOptions(
                arrayData.map((academicPeriod) => {
                    return {
                        label: academicPeriod.name,
                        value: academicPeriod.id
                    }
                })
            )
        }
        )
    }

    let emptyProgram = {
        id: null,
        code: '',
        name: '',
        academicPeriod: null,
    };

    useEffect(() => {
        loadProgram();
        loadAcademicPeriod();
    }, []);

    console.log("programs", program);

    const openNew = () => {
        setProgram(emptyProgram);
        setSubmitted(false);
        setProgramDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProgramDialog(false);
    }

    const hideDeleteProductDialog = () => {
        setDeleteProgramDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProgramsDialog(false);
    }

    const saveProgram = () => {
        setSubmitted(true);
        //completo los campos 
        console.log("este", program);
        delete program.id; //elimino el id porque es autoincrementable
        //busco el programa seleccionado
        let selectAcademicPeriod = academicPeriod.find(academicPeriod => academicPeriod.id === program.academicPeriod);
        program.academicPeriod = selectAcademicPeriod ? selectAcademicPeriod : null;
        console.log("que paso", program);
        if (program.name.trim()) {
            //hago la peticion a la api para guardar el registro
            axios.post("http://localhost:8080/program", program)
                .then(response => {
                    if (response.data != null) {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Programa creado', life: 5000 });
                        setProgramDialog(false);
                        setProgram(emptyProgram);
                        loadAcademicPeriod();
                    }
                });
        }
    }

    const editProduct = (program) => {
        setProgram({ ...program });
        setProgramDialog(true);
    }

    const deleteProduct = () => {
        let _products = programs.filter(val => val.id !== program.id);
        setPrograms(_products);
        setDeleteProgramDialog(false);
        setProgram(emptyProgram);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    }

    const deleteSelectedProducts = () => {
        let _products = programs.filter(val => !selectedPrograms.includes(val));
        setPrograms(_products);
        setDeleteProgramsDialog(false);
        setSelectedPrograms(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...program };
        _product[`${name}`] = val;

        setProgram(_product);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                {/* <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedPrograms || !selectedPrograms.length} /> */}
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <FileUpload mode="basic" name="demo[]" auto url="https://primefaces.org/primereact/showcase/upload.php" accept=".csv" chooseLabel="Import" className="mr-2 inline-block" onUpload={importCSV} />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} /> */}
            </React.Fragment>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} /> */}
                <Button label="Competencias asociadas" />
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Programas</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" style={{ color: "gray" }} onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" style={{ color: "#5EB319" }} onClick={saveProgram} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={programs} selection={selectedPrograms} onSelectionChange={(e) => setSelectedPrograms(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} programas"
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                    <Column field="id" header="Id" style={{ minWidth: '12rem' }}></Column>
                    <Column field="code" header="Código" style={{ minWidth: '16rem' }}></Column>
                    <Column field="name" header="Nombre" ></Column>
                    <Column field="academicPeriod" header="Periodo Académico" ></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={programDialog} style={{ width: '450px' }}
                header={<img src={logo} alt={"logo"} className="block m-auto pb-0 " />}
                modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="title-form" style={{ color: "#5EB319", fontWeight: "bold", fontSize: "22px" }}>
                    <p style={{ marginTop: "0px" }}>
                        Crear Programa
                    </p>
                </div>
                <div className="field">

                    <label htmlFor="code">Código</label>
                    <InputText
                        id="code"
                        value={program.code}
                        onChange={(e) => onInputChange(e, 'code')}
                        required autoFocus
                        className={classNames({ 'p-invalid': submitted && !program.code })} />
                    {submitted && !program.code && <small className="p-error">Código requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="type">Nombre</label>
                    <InputText
                        id="name"
                        value={program.name}
                        onChange={(e) => onInputChange(e, 'name')}
                        required autoFocus
                        className={classNames({ 'p-invalid': submitted && !program.name })} />
                    {submitted && !program.name && <small className="p-error">Nombre requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="academicPeriod">Periodo Académico</label>
                    <Dropdown
                        style={{
                            borderBlockColor: "#5EB319",
                            boxShadow: "0px 0px 0px 0.2px #5EB319",
                            borderColor: "#5EB319",

                        }}
                        name="academicPeriod"
                        value={selectAcademicPeriod}
                        options={academicPeriodOptions}
                        onChange={(e) => {
                            setSelectAcademicPeriod(e.value)
                            onInputChange(e, 'academicPeriod')
                        }}
                        optionLabel="label"
                        placeholder="Seleccione periodo académico"
                    />
                </div>
            </Dialog>

            <Dialog visible={deleteProgramDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {program && <span>Are you sure you want to delete <b>{program.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteProgramsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {program && <span>Are you sure you want to delete the selected programs?</span>}
                </div>
            </Dialog>
        </div>
    );
}
export default DashboardProgram;
