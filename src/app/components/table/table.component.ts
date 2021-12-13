import { Component, OnInit, Renderer2  } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
// import { loadURLSVGs, Table } from '@dds-uicore/all';
declare var UIC: any; // Use declare if you import via CDN. Regular Angular (node_modules) usage would be via an import

// formBuilder tutorial https://www.positronx.io/angular-7-select-dropdown-examples-with-reactive-forms/

@Component({
    selector: 'app-table-component',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit {
    public dlsTable: UIC.Table;
    columns: any = []
    searchTerm = '';
    isSubmitted = false;

    modalTitle = 'Default Title';
    modalBody = 'Default Body';
    modalYes = 'Yes';
    modalNo = 'No';
  
    constructor(
        public fb: FormBuilder, 
        private renderer: Renderer2
    ) { }
    
    /*########### Form ###########*/
    searchForm = this.fb.group({
        columnName: ['', [Validators.required]],
        searchText: ['', [Validators.required]]
    })

    // Getter method to access formcontrols
    get columnName() {
        return this.searchForm.get('columnName');
    }
    get searchText() {
        return this.searchForm.get('searchText');
    }

    /*########### Template Driven Form ###########*/
    onSubmit() {
        this.isSubmitted = true;
        this.dlsTable.page(1);
        // this.dlsTable.perPage({
        //     perPage: 10,
        //     page: 1
        //   });
        if (!this.searchForm.valid) {
            return false;
        } else {
            // perform a new data search using searchForm values
            // console.log(
            //     this.searchForm.value.columnName,
            //     this.searchForm.value.searchText
            // );
            // something like
            const options = {
                data : {
                    headings: [
                        "Id",
                        "Name",
                        "Username",
                        "Email",
                        "Phone",
                        "Website"
                    ],
                    columns: [],
                    rows :[
                        {
                            data: [
                                "1",
                                "Search Result",
                                "Serchy",
                                "Serch@rezult.biz",
                                "1-123-123-1234 x56442",
                                "sresult.org"
                            ],
                            dataIndex: 0
                        },{
                            data: [
                                "1",
                                "Search Result",
                                "Serchy",
                                "Serch@rezult.biz",
                                "1-123-123-1234 x56442",
                                "sresult.org"
                            ],
                            dataIndex: 1
                        },{
                            data: [
                                "1",
                                "Search Result",
                                "Serchy",
                                "Serch@rezult.biz",
                                "1-123-123-1234 x56442",
                                "sresult.org"
                            ],
                            dataIndex: 2
                        }
                    ]
                }
            };
            this.reloadTableData(options);
        }
    }  

    reset() {
        this.isSubmitted = false;
        this.reloadTableData({});
        alert('you will just need to reset the data')
    }

    reloadTableData(options: any) {
        this.dlsTable.deleteAll();
        
        // converts all to strings
        // options.data.rows.map((r: any, rI: number) => {
        //     r.data.map((td: any, tdI: number) => {
        //         console.log(options.data.rows[rI].data[tdI])
        //         options.data.rows[rI].data[tdI] = td.toString();
        //     });
        // });
        
        this.dlsTable.import(options);
        this.dlsTable.setItems(options.data.rows.length);
    }

    ngOnInit() {
        console.clear();
        let self = this;

        // Some UICore components require SVGs; loadURLSVGs accepts two parameters: an array of the SVGs to load, and a boolean for whether or not to lazy-load.  True by default; this Sandbox requires False.
        UIC.loadURLSVGs([
            "https://uicore.dellcdn.com/1.3.4/svgs/dds__search.svg",
            "https://uicore.dellcdn.com/1.3.4/svgs/dds__import-alt.svg",
            "https://uicore.dellcdn.com/1.3.4/svgs/dds__handle.svg",
            "https://uicore.dellcdn.com/1.3.4/svgs/dds__chevron-right.svg",
            "https://uicore.dellcdn.com/1.3.4/svgs/dds__chevron-left.svg",
            "https://uicore.dellcdn.com/1.3.4/svgs/dds__loading-sqrs.svg",
            "https://uicore.dellcdn.com/1.3.4/svgs/dds__chevron-right.svg",
            "https://uicore.dellcdn.com/1.3.4/svgs/dds__arrow-tri-solid-right.svg",
            "https://uicore.dellcdn.com/1.3.4/svgs/dds__printer.svg",
            "https://uicore.dellcdn.com/1.3.4/svgs/dds__gear.svg"
        ], false);


        // gets data from api, create options ... 
        this.getData()
            .then((data) => this.createOptions(data))
            .then((options) => {
                // then and initilize DDS Table element 
                const tableElement = document.querySelector("[data-table=\"dds__table\"]");
                this.dlsTable = (new UIC.Table(tableElement, options));
                this.renderActionButtons();
            });

        document.addEventListener("uicPaginationPageUpdateEvent", (e: any) => {
            console.log(e.detail);
            this.renderActionButtons();
        })


        // example of observing a DLS custom event and acting upon it
        // DAN says:  This is the "built-in" method, but I DO NOT like it.  Don't follow this eventlistener pattern.
        document.addEventListener("uicTableSearchEvent", async function handleSearchEvent(e: any) {
            function mapData(newData: any) { // you would want to create your own mapping
                var data = {
                    data: {
                        headings: [
                            "Id",
                            "Name",
                            "Username",
                            "Email",
                            "Phone",
                            "Website"
                        ],
                        rows: [
                            {
                                data: [
                                    newData[0].id.toString(),
                                    newData[0].name,
                                    newData[0].username,
                                    newData[0].email,
                                    newData[0].phone,
                                    newData[0].website
                                ],
                                details: "some random details"
                            }
                        ]
                    }
                };
                return data;
            };

            const data = await fetch('https://jsonplaceholder.typicode.com/users?id=' + e.detail.query)
                .then(response => response.json());
            if (data.length > 0) {
                var mappedData = mapData(data);

                self.dlsTable.deleteAll();
                self.dlsTable.import(mappedData);
                self.dlsTable.setItems(mappedData.data.rows.length); 
            }
        })
    }

    renderActionButtons() {
        const tableElement = document.querySelector("[data-table=\"dds__table\"]");
        tableElement.querySelectorAll('actionPlaceholder').forEach((ph) => {
            const rowId = ph.innerHTML.trim();
            const aBtn: HTMLButtonElement = this.renderer.createElement('button');
            aBtn.setAttribute('class', 'dds__btn dds__btn-primary actionButton');
            aBtn.innerText = '+';
            aBtn.setAttribute('data-id', rowId)
            aBtn.onclick = (e: any) => this.handleAction(e);
            this.renderer.appendChild(ph.parentElement, aBtn);
            ph.remove();
        });
    }

    handleAction(e: any) {        
        const rowId = e.target.getAttribute('data-id');
        this.modalTitle = 'modal title' + rowId;
        this.modalBody = 'modal body';
        this.modalYes = 'yes';
        this.modalNo = 'no';
        const placeHolder = document.getElementById('modalPlaceholder');

        if (!document.getElementById("modalTrigger" + rowId)) {
        const aModal: HTMLButtonElement = this.renderer.createElement('button');
            aModal.id = "modalTrigger" + rowId;
            aModal.setAttribute('data-toggle', 'dds__modal');
            aModal.setAttribute('data-target', '#exampleModal');
            aModal.setAttribute('role', 'button');
            aModal.setAttribute('class', 'dds__btn dds__btn-primary');
            aModal.style.display = 'none';
            aModal.innerText = "should not be visible";    
            this.renderer.appendChild(placeHolder, aModal);
        }
        const modalElement = document.getElementById("modalTrigger" + rowId);
        const thisModal = new UIC.Modal(modalElement, {
            backdrop: 'static'
        });

        thisModal.show();
        // placeHolder.removeChild(aModal);
    }
    
    // you can use fetch() as below, or the angular way with rxjs Observables 
    async getData(): Promise<any> {
        const data = await fetch('https://jsonplaceholder.typicode.com/users/')
            .then(response => response.json());
        return data;
    }

    // build options to bind to the component
    async createOptions(data): Promise<any> {
        data.forEach((rec: any) => {
            rec.actions = `
                <actionPlaceholder>${rec.id}</actionPlaceholder>
            `;
        });
    
        // jsonplaceholder returns all 10 users, lets just limit that to 5
        while (data.length > 5) {
            data.pop();
        }

        const columns = ['Id', 'Name', 'Username', 'Actions', 'Email', 'Phone', 'Website'];
        this.populateDropdown(columns);

        // here we can set the parameters we want ...
        return {
            settings: true,
            print: true,
            import: true,
            column: true,
            sort: true,
            select: true,
            expand: true,
            condensed: false,
            fixedColumns: true,
            fixedHeight: true,
            exportDetails: true,
            header: true,
            items: data.length,
            search: false,
            actions: true,
            perPage: 2,
            perPageSelect: [2, 4, 6, 8, 10],
            data: {
                headings: columns,
                columns: [],
                rows: await data.map(
                    (obj: any) => {
                        // ... and structure data from the api the way we want
                        return {
                            data: [obj.id, obj.name, obj.username, obj.actions, obj.email, obj.phone, obj.website]
                        }
                    }
                )
            }
        }
    }

    
    populateDropdown(columns: any): void {
        this.columns = columns;
    }

}
