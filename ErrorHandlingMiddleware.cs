using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace RuleSpecificationManager
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _logger = logger;
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                var methodValue = context.Request.Path.Value;
                _logger.LogInformation(string.Concat("Invoking ", methodValue));

                await _next(context);

                _logger.LogInformation(string.Concat("Completed ", methodValue));
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
            }
        }
    }
}