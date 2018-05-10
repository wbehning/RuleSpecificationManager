/*
    this class does the following:
    - loads dataStore.rulespecifications with rulespecifications from API
    - the subscription's next event pushes a new copy of the dataStore arrays to the BehaviorSubjects
    - Ultimately the BehaviorSubjects are exposed as the Observable Output streams
    - 
*/

import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { RuleSpecification } from "../models/RuleSpecification";
import { Specification } from "../models/Specification";

@Injectable()
export class RuleSpecificationService {
    // Observable Output Streams
    public ruleSpecifications: Observable<RuleSpecification[]>

    // Using BehaviorSubjects to receive and emit data
    private _ruleSpecifications: BehaviorSubject<RuleSpecification[]> = new BehaviorSubject([]);


    // In Memory data
    private dataStore: { ruleSpecifications: RuleSpecification[] } = { ruleSpecifications: [] };

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) {
        // Create the observable streams from the BehaviorSubjects
        this.ruleSpecifications = this._ruleSpecifications.asObservable();
    }

    loadAll() {
        this.http.get(`${this.baseUrl}api/SampleData/RuleSpecifications`)
            .map(response => response.json())
            .subscribe(data => {
                this.dataStore.ruleSpecifications = data;
                this._ruleSpecifications.next(Object.assign({}, this.dataStore).ruleSpecifications);
            }, error => console.log('Could not load  Rule Specifications.'));

    }

    create(ruleSpecification: RuleSpecification) {
        this.http.post(`${this.baseUrl}api/SampleData/CreateRuleSpecification`, ruleSpecification)
            .map(response => response.json())
            .subscribe(data => {
                this.dataStore.ruleSpecifications.push(data);
                this._ruleSpecifications.next(Object.assign({}, this.dataStore).ruleSpecifications);
            }, error => console.log('Could not create Rule Specifiction.'));
    }

    update(ruleSpecification: RuleSpecification) {
        this.http.post(`${this.baseUrl}/api/SampleData/UpdateRuleSpecification`, ruleSpecification)
            .map(response => response.json())
            .subscribe(data => {
                this.dataStore.ruleSpecifications.forEach((ruleSpecification, index) => {
                    if (ruleSpecification.ruleSpecificationId === data.ruleSpecificationId) {
                        this.dataStore.ruleSpecifications[index] = data;
                    }
                });
                this._ruleSpecifications.next(Object.assign({}, this.dataStore).ruleSpecifications);
            }, error => console.log('Could not update Rule Specification.'));
    }
}