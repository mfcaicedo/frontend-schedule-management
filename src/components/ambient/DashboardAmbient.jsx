import React, { useEffect, useRef, useState } from "react";
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import logo from '../../assets/img/logo.png';
import '../../App.css';

import axios from "axios";

function DashboardAmbient() {

    const [ambients, setAmbients] = useState(null);
    const [ambientDialog, setAmbientDialog] = useState(false);
    const [deleteAmbientDialog, setDeleteAmbientDialog] = useState(false);
    const [deleteAmbientsDialog, setDeleteAmbientsDialog] = useState(false);
    const [ambient, setAmbient] = useState([]);
    const [selectedAmbient, setSelectedAmbient] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectType, setSelectType] = useState(null);

    //Referencias 
    const toast = useRef(null);
    const dt = useRef(null);

    const loadAmbient = () => {
        let baseUrl = "http://localhost:8080/ambient";
        axios.get(baseUrl).then(response =>
            setAmbients(
                response.data.map((ambient) => {
                    return {
                        id: ambient.id,
                        name: ambient.name,
                        location: ambient.location,
                        typeEnvironment: ambient.typeEnvironment,
                        ability: ambient.ability,
                        state: ambient.state
                    }
                })
            )
        );
    };

    let emptyAmbient = {
        id: null,
        name: '',
        location: '',
        typeEnvironment: -1,
        ability: '',
        state: '',
    };

    const typeOptions = [
        {
            label: 'Virtual',
            input: 0
        },
        {
            label: 'Presencial',
            input: 1
        }
    ];

    useEffect(() => {
        loadAmbient();
        console.log("producr", ambient)

    }, []);

    console.log("ambients", ambient);

    const openNew = () => {
        setAmbient(emptyAmbient);
        setSubmitted(false);
        setAmbientDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setAmbientDialog(false);
    }

    const hideDeleteProductDialog = () => {
        setDeleteAmbientDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteAmbientsDialog(false);
    }

    const saveAmbient = () => {
        setSubmitted(true);
        //completo los campos 
        ambient.state = 'Activo';
        ambient.typeEnvironment = ambient.typeEnvironment.input;
        delete ambient.id; //elimino el id porque es autoincrementable
        if (ambient.name.trim()) {
            //hago la peticion a la api para guardar el registro
            axios.post("http://localhost:8080/ambient", ambient)
                .then(response => {
                    if (response.data != null) {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ambiente creado', life: 5000 });
                        setAmbientDialog(false);
                        setAmbient(emptyAmbient);
                        loadAmbient();
                    }
                });
        }
    }

    const editProduct = (ambient) => {
        setAmbient({ ...ambient });
        setAmbientDialog(true);
    }

    const confirmDeleteProduct = (ambient) => {
        setAmbient(ambient);
        setDeleteAmbientDialog(true);
    }

    const deleteProduct = () => {
        let _products = ambients.filter(val => val.id !== ambient.id);
        setAmbients(_products);
        setDeleteAmbientDialog(false);
        setAmbient(emptyAmbient);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    }

    const confirmDeleteSelected = () => {
        setDeleteAmbientsDialog(true);
    }

    const deleteSelectedProducts = () => {
        let _products = ambients.filter(val => !selectedAmbient.includes(val));
        setAmbients(_products);
        setDeleteAmbientsDialog(false);
        setSelectedAmbient(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...ambient };
        _product[`${name}`] = val;

        setAmbient(_product);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Inactivar" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedAmbient || !selectedAmbient.length} />
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
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Ambientes</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" style={{ color: "gray" }} onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" style={{ color: "#5EB319" }} onClick={saveAmbient} />
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
                <DataTable ref={dt} value={ambients} selection={selectedAmbient} onSelectionChange={(e) => setSelectedAmbient(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} ambientes"
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                    <Column field="id" header="Id" style={{ minWidth: '12rem' }}></Column>
                    <Column field="name" header="Nombre" style={{ minWidth: '16rem' }}></Column>
                    <Column field="location" header="Ubicación" ></Column>
                    <Column field="typeEnvironment" header="Tipo de ambiente" ></Column>
                    <Column field="state" header="Estado" ></Column>
                    {/* //<Column field="state" header="Estado" style={{ minWidth: '8rem' }}></Column> */}
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={ambientDialog} style={{ width: '450px' }}
                header={<img src={logo} alt={"logo"} className="block m-auto pb-0 " />}
                modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="title-form" style={{ color: "#5EB319", fontWeight: "bold", fontSize: "22px" }}>
                    <p style={{ marginTop: "0px" }}>
                        Crear Ambiente
                    </p>
                </div>
                <div className="field">
                    <label htmlFor="name">Nombre</label>
                    <InputText
                        id="name"
                        value={ambient.name}
                        onChange={(e) => onInputChange(e, 'name')}
                        required autoFocus
                        className={classNames({ 'p-invalid': submitted && !ambient.name })} />
                    {submitted && !ambient.name && <small className="p-error">Nombre es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="location">Ubicación</label>
                    <InputText
                        id="location"
                        value={ambient.location}
                        onChange={(e) => onInputChange(e, 'location')}
                        required autoFocus
                        className={classNames({ 'p-invalid': submitted && !ambient.location })} />
                    {submitted && !ambient.location && <small className="p-error">Ubicación es requerida.</small>}
                </div>
                <div className="field">
                    <label htmlFor="typeEnvironment">Tipo de ambiente</label>
                    <Dropdown
                        style={{
                            borderBlockColor: "#5EB319",
                            boxShadow: "0px 0px 0px 0.2px #5EB319",
                            borderColor: "#5EB319",
                        }}
                        name="typeEnvironment"
                        value={selectType}
                        options={typeOptions}
                        onChange={(e) => {
                            setSelectType(e.value)
                            onInputChange(e, "typeEnvironment")
                            console.log("prueba", e.value)
                        }}
                        optionLabel="label"
                        placeholder="Seleccione tipo"
                    />
                </div>
                <div className="field">
                    <label htmlFor="ability">Capacidad</label>
                    <InputText
                        id="ability"
                        value={ambient.ability}
                        onChange={(e) => onInputChange(e, 'ability')}
                        required autoFocus
                        className={classNames({ 'p-invalid': submitted && !ambient.ability })} />
                    {submitted && !ambient.ability && <small className="p-error">Capacidad es requerida.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteAmbientDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {ambient && <span>Are you sure you want to delete <b>{ambient.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteAmbientsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {ambient && <span>Are you sure you want to delete the selected ambients?</span>}
                </div>
            </Dialog>
        </div>
    );
}
export default DashboardAmbient;
