import React, { useEffect, useRef, useState } from "react";
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
// import { ProductService } from '../service/ProductService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { CascadeSelect } from 'primereact/cascadeselect';
import { Dropdown } from 'primereact/dropdown';
import logo from '../../assets/img/logo.png';
import '../../App.css';

import axios from "axios";

function DashboardCompetence() {

    const [competence, setCompetence] = useState([]);
    const [competences, setCompetences] = useState([]);
    const [productDialog, setProductDialog] = useState(false);
    const [disabledCompetenceDialog, setDeleteProductDialog] = useState(false);
    const [disabledCompetencesDialog, setDisabledCompetencesDialog] = useState(false);
    const [product, setProduct] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectType, setSelectType] = useState(null);
    const [selectProgram, setSelectProgram] = useState(null);
    const [program, setProgram] = useState(new Array());
    const [optionsProgram, setOptionsProgram] = useState([]);

    //Referencias
    const toast = useRef(null);
    const dt = useRef(null);

    /**
     * Metodo para cargar las competencias de la base de datos
     */
    const loadCompetence = () => {
        let baseUrl = "http://localhost:8080/competence";
        axios.get(baseUrl).then(response => {
            setCompetences(
                response.data.map((competence) => {
                    return {
                        id: competence.id,
                        name: competence.name,
                        type: competence.type,
                        state: competence.state,
                        program_id: competence.program_id
                    }
                })
            )
        }
        );
    };

    /**
     * Metodop para cargar los programas de la base de datos
     */
    const loadProgram = () => {
        let baseUrl = "http://localhost:8080/program";
        let arrayData = [];
        axios.get(baseUrl).then(response => {
            setProgram(response.data)
            //agrego al array de programas 
            arrayData = response.data
            setOptionsProgram(
                arrayData.map((program) => {
                    return {
                        label: program.name,
                        value: program.id
                    }
                }))
        }
        );
    };

    /**
     * Rrepresentacion del objeto que se va a guardar en la base de datos
     */
    let emptyCompetence = {
        id: null,
        name: '',
        type: '',
        state: '',
        program: null,
    };

    const typeOptions = [
        {
            label: 'Genérica',
            input: 'Generica'
        },
        {
            label: 'Específica',
            input: 'Especifica'
        }
    ];

    useEffect(() => {
        loadCompetence();
        loadProgram();

    }, []);


    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    const openNew = () => {
        setProduct(emptyCompetence);
        setSubmitted(false);
        setProductDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    }

    const hideDisabledCompetenceDialog = () => {
        setDeleteProductDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDisabledCompetencesDialog(false);
    }

    const saveProduct = () => {
        setSubmitted(true);
        //completo los campos 
        console.log("este", product);
        product.state = 'Activo';
        product.type = product.type.input;
        delete product.id; //elimino el id porque es autoincrementable
        //busco el programa seleccionado
        let selectProgram = program.find(program => program.id === product.program);
        product.program = selectProgram ? selectProgram : null;
        console.log("que paso", product);
        // return 0 ; 
        if (product.name.trim()) {
            //hago la peticion a la api para guardar el registro
            axios.post("http://localhost:8080/competence", product)
                .then(response => {
                    if (response.data != null) {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Competencia creada', life: 5000 });
                        setProductDialog(false);
                        setProduct(emptyCompetence);
                        loadCompetence();
                    }
                });
        }

        // return 0; 

        // if (product.name.trim()) {
        //     let _products = [...competences];
        //     let _product = { ...product };
        //     if (product.id) {
        //         const index = findIndexById(product.id);

        //         _products[index] = _product;
        //         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        //     }
        //     else {
        //         _product.id = createId();
        //         _product.image = 'product-placeholder.svg';
        //         _products.push(_product);
        //         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        //     }

        //     setCompetences(_products);
        //     setProductDialog(false);
        //     setProduct(emptyCompetence);
        // }
    }

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    }

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    }
    /**
     * Metodo para desactivar una competencia de la base de datos
     */
    const disabledCompetence = () => {
        //desactivo el registro en la base de datos 
        axios.patch("http://localhost:8080/competence/disable/" + product.id)
            .then(response => {
                if (response.data != null) {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Competencia desactivada', life: 5000 });
                    setDeleteProductDialog(false);
                    setProduct(emptyCompetence);
                    loadCompetence();
                }
            });
        // let _products = competences.filter(val => val.id !== product.id);
        // setCompetences(_products);
        // setDeleteProductDialog(false);
        // setProduct(emptyCompetence);
        // toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Competencia desactivda', life: 5000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < competences.length; i++) {
            if (competences[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    const importCSV = (e) => {
        const file = e.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const csv = e.target.result;
            const data = csv.split('\n');

            // Prepare DataTable
            const cols = data[0].replace(/['"]+/g, '').split(',');
            data.shift();

            const importedData = data.map(d => {
                d = d.split(',');
                const processedData = cols.reduce((obj, c, i) => {
                    c = c === 'Status' ? 'inventoryStatus' : (c === 'Reviews' ? 'rating' : c.toLowerCase());
                    obj[c] = d[i].replace(/['"]+/g, '');
                    (c === 'price' || c === 'rating') && (obj[c] = parseFloat(obj[c]));
                    return obj;
                }, {});

                processedData['id'] = createId();
                return processedData;
            });

            const _products = [...competences, ...importedData];

            setCompetences(_products);
        };

        reader.readAsText(file, 'UTF-8');
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        setDisabledCompetencesDialog(true);
    }

    const deleteSelectedProducts = () => {
        let _products = competences.filter(val => !selectedProducts.includes(val));
        setCompetences(_products);
        setDisabledCompetencesDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Competencias desactivadas', life: 5000 });
    }

    const onCategoryChange = (e) => {
        let _product = { ...product };
        _product['category'] = e.value;
        setProduct(_product);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" name="demo[]" auto url="https://primefaces.org/primereact/showcase/upload.php" accept=".csv" chooseLabel="Import" className="mr-2 inline-block" onUpload={importCSV} />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        )
    }

    const imageBodyTemplate = (rowData) => {
        return <img src={`images/product/${rowData.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="product-image" />
    }

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    }

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    }

    const statusBodyTemplate = (rowData) => {
        return <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
    }

    /**
     * Template de las acciones de la tabla de competencias
     * @param {*} rowData informacion de la fila
     * @returns 
     */
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-eye-slash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Manage Products</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const competenceDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" style={{color:"gray"}} className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" style={{color:"#5EB319"}} className="p-button-text" onClick={saveProduct} />
        </React.Fragment>
    );
    const disabledCompentenceDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" style={{color:"gray"}} className="p-button-text" onClick={hideDisabledCompetenceDialog} />
            <Button label="Si" icon="pi pi-check" style={{color:"#5EB319"}} className="p-button-text" onClick={disabledCompetence} />
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
                <DataTable ref={dt} value={competences} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} competences"
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                    <Column field="id" header="Id" style={{ minWidth: '12rem' }}></Column>
                    <Column field="name" header="Nombre" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="type" header="Tipo" ></Column>
                    <Column field="state" header="Estado" style={{ minWidth: '8rem' }}></Column>
                    <Column field="program" header="Programa" sortable style={{ minWidth: '10rem' }}></Column>
                    {/* <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '450px' }}
                header={<img src={logo} alt={"logo"} className="block m-auto pb-0 " />}
                modal className="p-fluid" footer={competenceDialogFooter} onHide={hideDialog}>
                <div className="title-form" style={{ color: "#5EB319", fontWeight: "bold", fontSize: "22px" }}>
                    <p style={{ marginTop: "0px" }}>
                        Crear competencia
                    </p>
                </div>
                <div className="field">

                    <label htmlFor="name">Nombre</label>
                    <InputText
                        id="name"
                        value={product.name}
                        onChange={(e) => onInputChange(e, 'name')}
                        required autoFocus
                        className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="type">Tipo</label>
                    <Dropdown
                        style={{
                            borderBlockColor: "#5EB319",
                            boxShadow: "0px 0px 0px 0.2px #5EB319",
                            borderColor: "#5EB319",

                        }}
                        name="type"
                        value={selectType}
                        options={typeOptions}
                        onChange={(e) => {
                            setSelectType(e.value)
                            onInputChange(e, 'type')
                        }}
                        optionLabel="label"
                        placeholder="Seleccione tipo"
                    />
                </div>
                <div className="field">
                    <label htmlFor="program">Seleccione programa al que pertenece</label>
                    <Dropdown
                        style={{
                            borderBlockColor: "#5EB319",
                            boxShadow: "0px 0px 0px 0.2px #5EB319",
                            borderColor: "#5EB319",

                        }}
                        name="program"
                        value={selectProgram}
                        options={optionsProgram}
                        onChange={(e) => {
                            setSelectProgram(e.value)
                            onInputChange(e, 'program')
                        }}
                        optionLabel="label"
                        placeholder="Seleccione programa"
                    />
                </div>

            </Dialog>

            <Dialog visible={disabledCompetenceDialog} style={{ width: '450px'}} header="Desactivar competencia" modal footer={disabledCompentenceDialogFooter} onHide={hideDisabledCompetenceDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>¿Estás seguro(a) de desactivar la competencia <b>{product.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={disabledCompetencesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Are you sure you want to delete the selected competences?</span>}
                </div>
            </Dialog>
        </div>
    );
}
export default DashboardCompetence;
