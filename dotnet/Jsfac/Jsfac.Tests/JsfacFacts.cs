using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Jsfac.Tests
{
    public class JsfacFacts
    {
        [Fact]
        public void Test()
        {
            var jsfac = new Jsfac(Helper.JsfacPath, Helper.SampleJsPath);
            var itm = jsfac.Find("application", "main");

            Assert.Equal("application", itm.Module);
            Assert.Equal("main", itm.Name);
            Assert.True(itm.SourcePath.Contains("application.js"));
            Assert.Equal(3, itm.Dependencies.Count());
            Assert.Equal(5, jsfac.All.Count());
        }
    }
}
