using backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Microsoft.Extensions.Azure;
using Azure.Identity;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);

var AllowedOrigins = "_myAllowSpecificOrigins";
// Add services to the container.

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAdB2C"));

builder.Services.AddControllers();
builder.Services.AddDbContext<DiplomskiTurniriContext>(options => {
    options.UseSqlServer(builder.Configuration.GetConnectionString("DB"));
    }
);

builder.Services.AddOpenApiDocument();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowedOrigins,
                      policy =>
                      {
                          //TODO: promjeni url ili ga metni u config
                          policy.WithOrigins("*").AllowAnyHeader().AllowAnyMethod();
                      });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAzureClients(clientBuilder =>
{
    clientBuilder.AddBlobServiceClient(builder.Configuration.GetConnectionString("AzureBlob"));
    clientBuilder.UseCredential(new DefaultAzureCredential());
});

builder.Services.AddScoped<AzureBlobServices>();


var app = builder.Build();


// Configure the HTTP request pipeline.

app.UseOpenApi();
app.UseSwaggerUi3();

app.UseHttpsRedirection();

app.UseRouting();
app.UseCors(AllowedOrigins);
//test
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
