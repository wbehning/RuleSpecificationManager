using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RuleSpecificationManager.Models;
using RuleSpecificationManagerRepository.Repositories;

namespace RuleSpecificationManager.Controllers
{
    [Route("api/[controller]")]
    public partial class SampleDataController : Controller
    {
        private readonly IRuleSpecificationRepository _ruleSpecificationRepository;
        private readonly IMapper _mapper;

        private static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };


        public SampleDataController(IRuleSpecificationRepository ruleSpecificationRepository,IMapper mapper)
        {
            _ruleSpecificationRepository = ruleSpecificationRepository;
            _mapper = mapper;
        }


        [HttpGet("[action]")]
        public IEnumerable<WeatherForecast> WeatherForecasts()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                DateFormatted = DateTime.Now.AddDays(index).ToString("d"),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            });
        }

        [HttpGet("[action]")]
        public ICollection<Models.RuleSpecification> RuleSpecifications()
        {
            var ruleSpecifications = GetRuleSpecifications();

            return ruleSpecifications;
        }

        [HttpPost("[action]")]
        public RuleSpecification CreateRuleSpecification([FromBody]RuleSpecification ruleSpecification)
        {
            var ruleSpecificationEf = _ruleSpecificationRepository.CreateRuleSpecification();

            _mapper.Map(ruleSpecification, ruleSpecificationEf);
            var ruleSpecificationId = _ruleSpecificationRepository.CreateOrUpdateRuleSpecification(ruleSpecificationEf);

            return GetRuleSpecification(ruleSpecificationId);
        }

        [HttpPost("[action]")]
        public RuleSpecification UpdateRuleSpecification([FromBody]RuleSpecification ruleSpecification)
        {
            var ruleSpecificationId = ruleSpecification.RuleSpecificationId;
            var ruleSpecificationEf = _ruleSpecificationRepository.FindRuleSpecificationById(ruleSpecificationId);

            _mapper.Map(ruleSpecification, ruleSpecificationEf);
            ruleSpecificationId = _ruleSpecificationRepository.CreateOrUpdateRuleSpecification(ruleSpecificationEf);

            return GetRuleSpecification(ruleSpecificationId);
        }

        private RuleSpecification GetRuleSpecification(int ruleSpecificationId)
        {
            var ruleSpecificationEf =  _ruleSpecificationRepository.FindRuleSpecificationById(ruleSpecificationId);
            var ruleSpecification = _mapper.Map<RuleSpecification>(ruleSpecificationEf);
            return ruleSpecification;
        }

        public ICollection<RuleSpecification> GetRuleSpecifications()
        {
            var ruleSpecifications = _ruleSpecificationRepository.RuleSpecificationList();
            var retVal = _mapper.Map<ICollection<RuleSpecification>>(ruleSpecifications);
            return retVal;

            //var list = new List<RuleSpecification>();
            //var ruleSpecification = new RuleSpecification();
            //var specification = new Specification();

            //specification.EvaluationOperator = "Equal";
            //specification.EvaluationValue = "True";
            //specification.RuleSpecificationId = 1;
            //specification.RuleSpecificationProperty = "HideAgentInfoOnLetter";
            //specification.SatisfiedValue = "NoDisplay";
            //specification.SpecificationId = 1;
            //specification.MainGroup = 1;
            //specification.MainJoin = "And";
            //specification.SubJoin = "";
            //specification.SubGroup = 0;

            //ruleSpecification.RuleSpecificationId = 1;
            //ruleSpecification.Domain = "CPL";
            //ruleSpecification.RuleSpecificationClass = "AgentDisplayRule";
            //ruleSpecification.RuleSpecificationName = "CPLAgentDisplay";
            //ruleSpecification.DefaultValue = "DefaultAgentInfoDisplay";

            //ruleSpecification.Specifications = new List<Specification>() { specification };

            //list.Add(ruleSpecification);

            //return list;

        }


        public class WeatherForecast
        {
            public string DateFormatted { get; set; }
            public int TemperatureC { get; set; }
            public string Summary { get; set; }

            public int TemperatureF
            {
                get
                {
                    return 32 + (int)(TemperatureC / 0.5556);
                }
            }
        }

    }
}
