import { Specification } from "./Specification";

export class RuleSpecification {
    ruleSpecificationId: number;
    domain: string;
    ruleSpecificationClass: string;
    ruleSpecificationName: string;
    defaultValue: string;

    specifications: Specification[];
}
