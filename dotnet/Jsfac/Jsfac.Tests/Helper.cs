using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Jsfac.Tests
{
    static class Helper
    {
        public static string JsfacPath
        {
            get
            {
                return System.IO.Path.Combine(RootPath, "jsfac.js");
            }
        }

        public static string RootPath
        {
            get
            {
                var path = AppDomain.CurrentDomain.BaseDirectory;
                return path.Substring(0, path.IndexOf("dotnet", StringComparison.OrdinalIgnoreCase));
            }
        }

        public static string SampleJsPath
        {
            get
            {
                return System.IO.Path.Combine(RootPath, @"samples\knockoutjs\scripts");
            }
        }
    }
}
