using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace GroceryListApi.Middleware
{
    public class LoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<LoggingMiddleware> _logger;

        public LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var requestBodyStream = new MemoryStream();
            var originalRequestBody = context.Request.Body;

            try
            {
                await LogRequest(context, requestBodyStream, originalRequestBody);
                
                var originalResponseBody = context.Response.Body;
                using var responseBody = new MemoryStream();
                context.Response.Body = responseBody;

                var stopwatch = Stopwatch.StartNew();
                await _next(context);
                stopwatch.Stop();

                await LogResponse(context, stopwatch, responseBody, originalResponseBody);
            }
            finally
            {
                context.Request.Body = originalRequestBody;
            }
        }

        private async Task LogRequest(HttpContext context, MemoryStream requestBodyStream, Stream originalRequestBody)
        {
            context.Request.EnableBuffering();
            await context.Request.Body.CopyToAsync(requestBodyStream);
            requestBodyStream.Seek(0, SeekOrigin.Begin);

            var requestBodyText = await new StreamReader(requestBodyStream).ReadToEndAsync();
            requestBodyStream.Seek(0, SeekOrigin.Begin);
            
            context.Request.Body = requestBodyStream;

            _logger.LogInformation($"HTTP {context.Request.Method} {context.Request.Path} " +
                                  $"QueryString: {context.Request.QueryString} " +
                                  $"Request Body: {requestBodyText}");
        }

        private async Task LogResponse(HttpContext context, Stopwatch stopwatch, MemoryStream responseBody, Stream originalResponseBody)
        {
            responseBody.Seek(0, SeekOrigin.Begin);
            var responseBodyText = await new StreamReader(responseBody, Encoding.UTF8).ReadToEndAsync();
            responseBody.Seek(0, SeekOrigin.Begin);

            _logger.LogInformation($"HTTP {context.Request.Method} {context.Request.Path} " +
                                  $"responded {context.Response.StatusCode} in {stopwatch.ElapsedMilliseconds}ms " +
                                  $"Response Body: {responseBodyText}");

            await responseBody.CopyToAsync(originalResponseBody);
            context.Response.Body = originalResponseBody;
        }
    }
}
