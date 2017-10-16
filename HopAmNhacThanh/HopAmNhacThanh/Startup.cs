using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using HopAmNhacThanh.Data;
using HopAmNhacThanh.Models;
using HopAmNhacThanh.Services;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Serialization;
using Microsoft.Net.Http.Headers;
using HopAmNhacThanh.Areas.WebManager.Data;
using HopAmNhacThanh.Data.HomeRepository;

namespace HopAmNhacThanh
{
    public class Startup
    {
        private readonly IHostingEnvironment env;
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);
            this.env = env;
            if (env.IsDevelopment())
            {
                // For more details on using the user secret store see https://go.microsoft.com/fwlink/?LinkID=532709
                builder.AddUserSecrets<Startup>();
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddMemoryCache();
            services.Configure<GzipCompressionProviderOptions>(options => options.Level = System.IO.Compression.CompressionLevel.Optimal);
            services.AddResponseCompression(options =>
            {
                options.EnableForHttps = true;
                //options.Providers.Add<CustomCompressionProvider>();
                options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] { "image/svg+xml" });
            });




            //if (env.IsDevelopment())
            //{
            //    services.AddDbContext<ApplicationDbContext>(options =>
            //    options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            //}
            //else
            //{ 
            //services.AddResponseCaching();
            services.AddResponseCaching(options =>
            {
                options.UseCaseSensitivePaths = true;
                options.MaximumBodySize = 1024;
            });
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("VPSConnection")));
            //}
            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();
            services.
                AddMvc(options =>
                {
                    options.CacheProfiles.Add("Default",
                        new Microsoft.AspNetCore.Mvc.CacheProfile()
                        {
                            Duration = 60
                        });
                    options.CacheProfiles.Add("Never",
                        new Microsoft.AspNetCore.Mvc.CacheProfile()
                        {
                            Location = Microsoft.AspNetCore.Mvc.ResponseCacheLocation.None,
                            NoStore = true
                        });
                })
            .AddJsonOptions(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());



            services.AddDistributedMemoryCache(); // Adds a default in-memory implementation of IDistributedCache
            services.AddSession();
            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();
            services.AddScoped<ISongManagerRepository, SongManagerRepository>();
            services.AddScoped<IHomeRepository, HomeRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseResponseCaching();
            app.UseResponseCompression();
            app.UseStatusCodePagesWithReExecute("/StatusCode/{0}");

            app.UseStaticFiles(new StaticFileOptions()
            {
                OnPrepareResponse = (context) =>
                {
                    var headers = context.Context.Response.GetTypedHeaders();
                    headers.CacheControl = new CacheControlHeaderValue()
                    {
                        MaxAge = TimeSpan.FromSeconds(63072000),


                    };
                    // Cache static file for 1 year
                    //if (!string.IsNullOrEmpty(context.Context.Request.Query["v"]))
                    //{
                    //    context.Context.Response.Headers.Add("cache-control", new[] { "public,max-age=31536000" });
                    //    context.Context.Response.Headers.Add("Expires", new[] { DateTime.UtcNow.AddYears(1).ToString("R") }); // Format RFC1123
                    //}
                }
            });
            app.UseIdentity();

            // Add external authentication middleware below. To configure them please see https://go.microsoft.com/fwlink/?LinkID=532715
            // IMPORTANT: This session call MUST go before UseMvc()
            app.UseSession();


            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                LoginPath = "/quan-ly-web/dang-nhap",
                AuthenticationScheme = "Cookies",

                AutomaticAuthenticate = true,
                AutomaticChallenge = true
            });
            if (env.IsDevelopment())
            {
                //connect facebook localhost
                app.UseFacebookAuthentication(new FacebookOptions()
                {
                    AppId = "707542496098719",
                    AppSecret = "d5af1e86890606ff1705caede5893048"
                });
            }
            else
            {
                //connect facebook in vps
                app.UseFacebookAuthentication(new FacebookOptions()
                {
                    AppId = "283779168758487",
                    AppSecret = "16cbd9eafd6d2b5f6c1fb8b2fda3b1c6"
                });
            }
            // Add external authentication middleware below. To configure them please see https://go.microsoft.com/fwlink/?LinkID=532715

            app.UseMvc(routes =>
            {
                routes.MapRoute(name: "areaRoute",
                    template: "{area:exists}/{controller=Admin}/{action=Index}");
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
