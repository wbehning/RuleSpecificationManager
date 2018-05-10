using System.Collections.Generic;

namespace RuleSpecificationManager.Models
{
        public class RuleSpecification
        {
            public int RuleSpecificationId {get; set; }
            public string Domain { get; set; }
            public string RuleSpecificationClass { get; set; }
            public string RuleSpecificationName { get; set; }
            public string DefaultValue { get; set; }

            public IEnumerable<Specification> Specifications {get; set; }
        }
}
