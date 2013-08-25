using System.Collections.Generic;

namespace Jsfac
{
    public class JsfacRegistry
    {
        public string Module { get; set; }
        public string Name { get; set; }
        public string File { get; set; }
        public IEnumerable<JsfacRegistry> Dependencies { get; set; }
    }
}