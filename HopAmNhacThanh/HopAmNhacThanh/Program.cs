using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using HopAmNhacThanh.Models;
using Microsoft.Extensions.Logging;

namespace HopAmNhacThanh
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = new WebHostBuilder()
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseStartup<Startup>()
                .UseApplicationInsights()
                .Build();
            //using (var scope = host.Services.CreateScope())
            //{
            //    var services = scope.ServiceProvider;

            //    try
            //    {
            //        // Requires using RazorPagesMovie.Models;
            //        SeedData.FinalCategory(services);
            //        SeedData.FinalStyle(services);
            //        SeedData.FinalAlbum(services);
            //    }
            //    catch (Exception ex)
            //    {
            //        var logger = services.GetRequiredService<ILogger<Program>>();
            //        logger.LogError(ex.Message, "An error occurred seeding the DB.");
            //    }
            //}
            host.Run();
        }
    }
}
