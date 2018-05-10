using System.Collections.Generic;

namespace RuleSpecificationManager.Models
{
    public class Specification
    {
        public int SpecificationId { get; set; }
        public int RuleSpecificationId { get; set; }

        public string RuleSpecificationProperty { get; set; }
        public string EvaluationOperator { get; set; }
        public string EvaluationValue { get; set; }
        public int MainGroup { get; set; }
        public string MainJoin { get; set; }
        public int SubGroup { get; set; }
        public string SubJoin { get; set; }
        public string SatisfiedValue { get; set; }
    }
}