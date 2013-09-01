using System.Collections.Generic;

namespace Jsfac
{
    public class JsfacRegistry
    {
        public string Module { get; set; }
        public string Name { get; set; }
        public string SourcePath { get; set; } // replace with System.IO.Path
        public IEnumerable<JsfacRegistry> Dependencies { get; set; }
    }
}