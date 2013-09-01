using System;
using System.Collections.Generic;
using System.Linq;
using Jsfac.Internals;

namespace Jsfac
{
    public class Jsfac
    {
        readonly IEnumerable<JsfacRegistry> _registries;
        public Jsfac(string jsfac, string path)
        {
            var r = new Resolver();
            var c = new Converter();
            var itms = r.Resolve(jsfac, path);

            _registries = c.Convert(itms);
        }

        public JsfacRegistry Find(string module, string name)
        {
            var itm = _registries.SingleOrDefault(r => r.Name == name && r.Module == module);
            return itm;
        }

        public JsfacRegistry FindByPath(string path)
        {
            var itm = _registries.SingleOrDefault(r => string.Equals(r.SourcePath, path, StringComparison.OrdinalIgnoreCase));
            return itm;
        }

        public IEnumerable<JsfacRegistry> All
        {
            get { return _registries; }
        } 
    }
}