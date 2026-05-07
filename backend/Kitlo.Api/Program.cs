using Kitlo.Api.Auth;
using Kitlo.Api.Hubs;
using Kitlo.Api.Middleware;
using Kitlo.Api.Services;
using Kitlo.Data;
using Kitlo.Data.Seed;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ---------- Database ----------
var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException("ConnectionStrings:Default not configured");
builder.Services.AddDbContext<KitloDbContext>(opt =>
    opt.UseNpgsql(connectionString));

// ---------- JWT auth ----------
var jwt = builder.Configuration.GetSection("Jwt").Get<JwtSettings>()
    ?? throw new InvalidOperationException("Jwt section not configured");
builder.Services.AddSingleton(jwt);
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<RefreshTokenService>();
builder.Services.AddScoped<PasswordHasher>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = jwt.Issuer,
            ValidAudience = jwt.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),
            ClockSkew = TimeSpan.FromMinutes(1)
        };
        // Pull the access token from the `?access_token=` query string for SignalR
        // connections (browsers can't set Authorization headers on WebSocket handshakes).
        options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
        {
            OnMessageReceived = ctx =>
            {
                var path = ctx.HttpContext.Request.Path;
                var token = ctx.Request.Query["access_token"];
                if (!string.IsNullOrEmpty(token) && path.StartsWithSegments("/hubs"))
                {
                    ctx.Token = token!;
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(KitloPolicies.Admin, p => p.RequireRole("admin"));
    options.AddPolicy(KitloPolicies.Lister, p => p.RequireRole("lister", "admin"));
});

// ---------- Domain services ----------
builder.Services.AddScoped<ListingService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<BookingService>();
builder.Services.AddScoped<MessageService>();
builder.Services.AddScoped<RealtimeMessageService>();
builder.Services.AddScoped<NotificationService>();
builder.Services.AddScoped<ReviewService>();
builder.Services.AddScoped<DisputeService>();
builder.Services.AddScoped<PayoutService>();
builder.Services.AddScoped<AdminService>();
builder.Services.AddScoped<StripeService>();
builder.Services.AddScoped<WaitlistService>();

// ---------- ASP.NET ----------
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddOpenApi();

builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("http://localhost:4200")
     .AllowAnyHeader()
     .AllowAnyMethod()
     .AllowCredentials()));

var app = builder.Build();

// Apply pending migrations + seed dev data on startup. Skip when SkipDatabase is set
// (so the app can boot without Postgres for offline OpenAPI generation / smoke tests).
if (!app.Configuration.GetValue<bool>("SkipDatabase"))
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<KitloDbContext>();
    try
    {
        await db.Database.MigrateAsync();
        if (app.Environment.IsDevelopment())
        {
            var hasher = scope.ServiceProvider.GetRequiredService<PasswordHasher>();
            await SeedData.ApplyAsync(db, hasher.Hash);
        }
    }
    catch (Exception ex)
    {
        app.Logger.LogWarning(ex, "Database initialization skipped — connection failed.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<MessagesHub>("/hubs/messages");

app.Run();

public partial class Program { } // exposed for integration tests
