using Microsoft.Extensions.DependencyInjection;
using System;
using Volo.Abp;
using Volo.Abp.Security.Encryption;
using static System.Console;

namespace LINGYUN.Abp.Encryption.Console
{
    class Program
    {
        static void Main(string[] args)
        {
            WriteLine("Hello World!");

            var application = AbpApplicationFactory.Create<AbpEncryptionConsoleModule>();

            application.Initialize();

            while (true)
            {
                WriteLine("D: Giải mã E: Mã hóa Q: Thoát");

                var opt = ReadLine();
                var en = false;

                if (opt == "Q")
                {
                    break;
                }

                if ("E".Equals(opt, StringComparison.InvariantCultureIgnoreCase))
                {
                    en = true;
                    WriteLine("Vui lòng nhập chuỗi cần mã hóa");
                }
                else
                {
                    WriteLine("Vui lòng nhập chuỗi cần giải mã");
                }

                var sourceChr = ReadLine();
                var encryptionService = application.ServiceProvider.GetRequiredService<IStringEncryptionService>();
                WriteLine(en ? encryptionService.Encrypt(sourceChr) : encryptionService.Decrypt(sourceChr));

                WriteLine("Nhấn phím bất kỳ để tiếp tục");

                ReadKey();

                Clear();
            }

            application.Shutdown();
        }
    }
}
