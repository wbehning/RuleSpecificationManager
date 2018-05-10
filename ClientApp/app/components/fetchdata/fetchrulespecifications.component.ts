import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { RuleSpecification } from '../models/RuleSpecification';
import { RuleSpecificationService } from './../services/rulespecificationservice';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridDataResult, DataStateChangeEvent, GridComponent, EditEvent, SaveEvent, AddEvent, CancelEvent } from "@progress/kendo-angular-grid";
import { State, process } from '@progress/kendo-data-query';
import { Specification } from '../models/Specification';


@Component({
    selector: 'fetchrulespecifications',
    templateUrl: './fetchrulespecifications.component.html',
    //styleUrls: ['./fetchrulespecifications.component.css'],
    providers: [RuleSpecificationService]
})
export class FetchRuleSpecificationsComponent {
    public componentRulespecifications: RuleSpecification[];

    constructor(private _ruleSpecificationService: RuleSpecificationService, private formBuilder: FormBuilder) {

    }


    ngOnInit() {
        this._ruleSpecificationService.ruleSpecifications.subscribe(data => {
            this.componentRulespecifications = data
                , this.loadRuleSpecifications()
        });

        this._ruleSpecificationService.loadAll();
    }

    private loadRuleSpecifications() {
        this.gridView = process(this.componentRulespecifications, this.gridState);
    }

    //#region Kendo stuff

    private gridView: GridDataResult;

    // Paging - Sorting - Navigation
    public gridState: State = {
        filter: { filters: [], logic: "and" },
        group: [],
        skip: 0,
        sort: [],
        take: 5
    };

    private buttonCount: number = 5;
    private info: boolean = true;
    private type: 'numeric' | 'input' = 'numeric';
    private pageSizes: boolean = true;
    private previousNext: boolean = true;
    public multiple: boolean = true;
    public allowUnsort: boolean = true;

    // Angular Form for editing in grid
    public ruleSpecificationFormGroup: FormGroup;
    private editedRowIndex: number;

    //#endregion Kendo stuff

    //#region Grid Event Handlers

    protected dataStateChange(state: DataStateChangeEvent): void {
        this.gridState = state;
        this.loadRuleSpecifications();
    }

    public addHandler(e: AddEvent) {
        this.closeEditor(e.sender);

        var ruleSpecificationToAdd = new RuleSpecification();
        ruleSpecificationToAdd.ruleSpecificationId = 0;
        ruleSpecificationToAdd.domain = '';
        ruleSpecificationToAdd.defaultValue = '';
        ruleSpecificationToAdd.ruleSpecificationClass = '';
        ruleSpecificationToAdd.ruleSpecificationName = '';
        ruleSpecificationToAdd.specifications = [];

        this.createForm(ruleSpecificationToAdd);
        e.sender.addRow(this.ruleSpecificationFormGroup);
    }

    public editHandler(e: EditEvent) {
        this.closeEditor(e.sender);
        this.editedRowIndex = e.rowIndex;

        this.createForm(e.dataItem);

        e.sender.editRow(e.rowIndex, this.ruleSpecificationFormGroup);
    }

    public cancelHandler(e: CancelEvent) {
        this.closeEditor(e.sender);
    }

    public saveHandler(e: SaveEvent): void {
        this.closeEditor(e.sender);
        const ruleSpecificationData = e.formGroup.value;
        if (e.isNew) {
            this._ruleSpecificationService.create(ruleSpecificationData);
        }
        else {
            this._ruleSpecificationService.update(ruleSpecificationData);
        }
    }

    public removeHandler({ dataItem }): void {
        // this.service.remove(dataItem);
    }

    private closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.ruleSpecificationFormGroup = undefined;
    }

    //#endregion

    //#region Angular Forms for grid

    private createForm(ruleSpecification: RuleSpecification) {
        this.ruleSpecificationFormGroup = this.formBuilder.group(ruleSpecification);
        this.setSpecifications(ruleSpecification.specifications);
    }

    private setSpecifications(specifications: Specification[]) {
        const specificationFormGroup = specifications.map(specification => this.formBuilder.group(specification));
        const ruleSpecificationFormArray = this.formBuilder.array(specificationFormGroup);
        this.ruleSpecificationFormGroup.setControl('specifications', ruleSpecificationFormArray);
    }

    
    //#endregion






    //constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {
    //    http.get(baseUrl + 'api/SampleData/RuleSpecifications').subscribe(result => {
    //        this.rulespecifications = result.json() as RuleSpecification[];
    //    }, error => console.error(error));
    //}
}

