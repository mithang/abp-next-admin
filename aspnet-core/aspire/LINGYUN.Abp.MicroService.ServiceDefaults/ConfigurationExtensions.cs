using Microsoft.Extensions.Configuration;

namespace Microsoft.Extensions.Hosting;

public static class ConfigurationExtensions
{
    public static TBuilder MapDefaultConfiguration<TBuilder>(this TBuilder builder) where TBuilder : IHostApplicationBuilder
    {
        // DEVOPS iter-0009 (DEV-13): only register the Aspire Redis
        // client when Redis is actually configured (ConnectionStrings:redis
        // or Aspire:StackExchange:Redis:ConnectionString — the two sources
        // named by the factory's own error message). Standalone (no AppHost)
        // there is neither, and the factory throws "No endpoints specified"
        // at activation — but only AFTER Aspire's service-discovery lookup
        // burns 31-38 s, so every /healthz request paid that latency before
        // reporting Unhealthy (measured devops-0009: StackExchange.Redis
        // check 31594/32104/37386 ms, all other checks < 2 s). No service
        // code consumes Aspire's keyed Redis client (grep: zero consumers;
        // ABP's distributed lock and cache use their own multiplexer built
        // from Redis:Configuration), so skipping the registration standalone
        // only removes a check that could never succeed — it cannot break a
        // working host. Under the AppHost the connection string is present
        // and registration is unchanged. RabbitMQ stays unguarded: its check
        // fails fast (0.13 ms, connection refused) and keeps its truthful
        // Unhealthy signal.
        var redisConfigured =
            !string.IsNullOrWhiteSpace(builder.Configuration.GetConnectionString("redis"))
            || !string.IsNullOrWhiteSpace(builder.Configuration["Aspire:StackExchange:Redis:ConnectionString"]);
        if (redisConfigured)
        {
            builder.AddRedisClient("redis");
        }
        // DEVOPS iter-0009 (DEV-13 continued): same guard for the Aspire
        // RabbitMQ client. Standalone there is no ConnectionStrings:rabbitmq,
        // and resolving the client's IConnection stalls every /healthz
        // request by ~31 s (measured: self+redis finish in < 35 ms, then a
        // silent 31 s gap, then RabbitMQ.Client reports Unhealthy in
        // 0.4 ms with BrokerUnreachable to 127.0.0.1:5672 — the stall is in
        // the client-resolution path, NOT in the check itself, and giving
        // an explicit connection string does NOT remove it). No service
        // code consumes Aspire's keyed RabbitMQ IConnection (grep: zero
        // consumers; CAP and ABP use their own CAP:RabbitMQ /
        // RabbitMQ:Default configuration, remapped below), so skipping the
        // registration standalone only removes a check that could never
        // succeed there. Under the AppHost the connection string is present
        // and registration is unchanged.
        var rabbitMqConfigured =
            !string.IsNullOrWhiteSpace(builder.Configuration.GetConnectionString("rabbitmq"))
            || !string.IsNullOrWhiteSpace(builder.Configuration["Aspire:RabbitMQ:Client:ConnectionString"]);
        if (rabbitMqConfigured)
        {
            builder.AddRabbitMQClient("rabbitmq");
        }

        // DEVOPS iter-0008 (DEV-12): only register the Aspire Elasticsearch
        // client when Elasticsearch is actually configured. Standalone (no
        // AppHost) there is neither ConnectionStrings:elasticsearch nor an
        // Aspire:Elastic:Clients:Elasticsearch endpoint, and the client
        // factory then throws at activation time ("A ElasticsearchClient
        // could not be configured...") — an exception that escapes the
        // health-check middleware, so /healthz and /health answered 500
        // instead of 503 even though the gateway itself was running.
        // No service code injects ElasticsearchClient directly (Serilog
        // and audit logging use their own configuration), so skipping the
        // registration standalone only removes a check that could never
        // run — it cannot break a working host. Under the AppHost the
        // connection string is present and registration is unchanged.
        // (Note: the iter-0008 reasoning for leaving RabbitMQ unguarded —
        // "its check degrades to Unhealthy within 1 ms" — measured only the
        // check body, not the ~31 s client-resolution stall in front of it.
        // Devops-0009 corrects this: see DEV-13 above.)
        var elasticsearchConfigured =
            !string.IsNullOrWhiteSpace(builder.Configuration.GetConnectionString("elasticsearch"))
            || !string.IsNullOrWhiteSpace(builder.Configuration["Aspire:Elastic:Clients:Elasticsearch:Endpoint"]);
        if (elasticsearchConfigured)
        {
            builder.AddElasticsearchClient("elasticsearch");
        }

        // CAP PostgreSql
        builder.Configuration["CAP:PostgreSql:ConnectionString"] = builder.Configuration.GetConnectionString("Default");

        // CAP RabbitMQ
        builder.Configuration["CAP:RabbitMQ:HostName"] = builder.Configuration["RABBITMQ_HOST"];
        builder.Configuration["CAP:RabbitMQ:UserName"] = builder.Configuration["RABBITMQ_USERNAME"];
        builder.Configuration["CAP:RabbitMQ:Password"] = builder.Configuration["RABBITMQ_PASSWORD"];
        builder.Configuration["CAP:RabbitMQ:Port"] = builder.Configuration["RABBITMQ_PORT"];

        // Abp RabbitMQ
        builder.Configuration["RabbitMQ:Default:HostName"] = builder.Configuration["RABBITMQ_HOST"];
        builder.Configuration["RabbitMQ:Default:UserName"] = builder.Configuration["RABBITMQ_USERNAME"];
        builder.Configuration["RabbitMQ:Default:Password"] = builder.Configuration["RABBITMQ_PASSWORD"];
        builder.Configuration["RabbitMQ:Default:Port"] = builder.Configuration["RABBITMQ_PORT"];

        // Elsa RabbitMQ
        builder.Configuration["Elsa:Rebus:RabbitMQ:Connection"] = builder.Configuration.GetConnectionString("RabbitMQ");

        // Redis
        // DEVOPS iter-0007: only remap when the Aspire AppHost actually
        // supplied a Redis connection string. Standalone (no AppHost) the
        // call returns null, and the old code wrote ",defaultDatabase=10"
        // over whatever the app configured (or left it as garbage), so a
        // standalone host could never use its own Redis settings.
        var redisConnectionString = builder.Configuration.GetConnectionString("Redis");
        if (!string.IsNullOrWhiteSpace(redisConnectionString))
        {
            builder.Configuration["Redis:Configuration"] = $"{redisConnectionString},defaultDatabase=10";

            // DistributedLock
            builder.Configuration["DistributedLock:Redis:Configuration"] = $"{redisConnectionString},defaultDatabase=11";

            // Features
            builder.Configuration["Features:Validation:Redis:Configuration"] = $"{redisConnectionString},defaultDatabase=12";

            // SignalR
            builder.Configuration["SignalR:Redis:Configuration"] = $"{redisConnectionString},defaultDatabase=13,channelPrefix=abp-realtime-channel";
        }

        // Elasticsearch
        // DEVOPS iter-0007: same guard as Redis above. Standalone the
        // connection string is null, and the old code overwrote every
        // Serilog Elasticsearch sink's nodeUris with null, so the sink
        // threw "No Elasticsearch node(s) specified" at host build and
        // the Aspire ApiGateway could never start outside the AppHost
        // (previously misdiagnosed as a silent exit, devops-0006). With
        // the guard, AppHost runs keep the exact old behaviour (the URL
        // is remapped), while standalone runs keep their appsettings
        // nodeUris.
        var elasticSearchUrl = builder.Configuration.GetConnectionString("Elasticsearch");
        if (!string.IsNullOrWhiteSpace(elasticSearchUrl))
        {
            var serialogEsConfig = builder.Configuration.GetSection("Serilog:WriteTo");

            void ReplaceElasticsearchLogging(IConfiguration configuration)
            {
                foreach (var config in configuration.GetChildren())
                {
                    if (string.Equals(config["Name"], "Async", StringComparison.InvariantCultureIgnoreCase))
                    {
                        var configureArgs = config.GetSection("Args:configure");
                        ReplaceElasticsearchLogging(configureArgs);
                    }
                    if (string.Equals(config["Name"], "Elasticsearch", StringComparison.InvariantCultureIgnoreCase))
                    {
                        config["Args:nodeUris"] = elasticSearchUrl;
                    }
                }
            }

            if (serialogEsConfig.Exists())
            {
                ReplaceElasticsearchLogging(serialogEsConfig);
            }
            builder.Configuration["Elasticsearch:NodeUris"] = elasticSearchUrl;
        }

        return builder;
    }
}
