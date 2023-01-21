import React, { useEffect, useRef, useState } from "react";
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import logo from '../../assets/img/logo.png';
import '../../App.css';

import axios from "axios";

function DashboardAmbient() {

    const [competence, setCompetence] = useState([]);
    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectType, setSelectType] = useState(null);

    //Referencias 
    const toast = useRef(null);
    const dt = useRef(null);



    const loadAmbient = () => {
        let baseUrl = "http://localhost:8080/ambient";
        axios.get(baseUrl).then(response =>
            // setCompetence(response.data)
            setProducts(response.data)
        );
    };

    let emptyAmbient = {
        id: null,
        name: '',
        location: '',
        typeEnvironment: '',
        ability: '',
        state: '',
        schedule: null,
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
        loadAmbient();
        console.log("competence", competence)
        console.log("producr", product)

    }, []);


    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    console.log("products", product);

    const openNew = () => {
        setProduct(emptyAmbient);
        setSubmitted(false);
        setProductDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }

    const saveProduct = () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _products = [...products];
            let _product = { ...product };
            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            }
            else {
                _product.id = createId();
                _product.image = 'product-placeholder.svg';
                _products.push(_product);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyAmbient);
        }
    }

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    }

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = () => {
        let _products = products.filter(val => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyAmbient);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
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

            const _products = [...products, ...importedData];

            setProducts(_products);
        };

        reader.readAsText(file, 'UTF-8');
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    }

    const deleteSelectedProducts = () => {
        let _products = products.filter(val => !selectedProducts.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
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
                <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Inactivar"  className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
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
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" style= {{color: "gray"}} onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" style= {{color: "#5EB319"}} onClick={saveProduct} />
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
                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
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
                    <Column field="schedule" header="Schedule" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '450px' }}
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
                        value={product.name}
                        onChange={(e) => onInputChange(e, 'name')}
                        required autoFocus
                        className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="type">Ubicación</label>
                    <InputText
                        id="name"
                        value={product.name}
                        onChange={(e) => onInputChange(e, 'name')}
                        required autoFocus
                        className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="type">Tipo de ambiente</label>
                    <Dropdown
                        style={{
                            borderBlockColor: "#5EB319",
                            boxShadow: "0px 0px 0px 0.2px #5EB319",
                            borderColor: "#5EB319",

                        }}
                        name="type"
                        value={selectType}
                        options={typeOptions}
                        onChange={(e) => setSelectType(e.value)}
                        optionLabel="label"
                        placeholder="Seleccione tipo"
                    />
                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Are you sure you want to delete <b>{product.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Are you sure you want to delete the selected products?</span>}
                </div>
            </Dialog>
        </div>
    );
}
export default DashboardAmbient;
