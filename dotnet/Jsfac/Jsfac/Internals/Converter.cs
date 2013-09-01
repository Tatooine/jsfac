using System.Collections.Generic;
using System.Linq;

namespace Jsfac.Internals
{
    class Converter
    {
        public IEnumerable<JsfacRegistry> Convert(IEnumerable<Item> items)
        {
            var lst = items.Select(i => new 
                {   i.id,
                    i.depRefs,
                    Registry = new JsfacRegistry()
                        {
                            Module = i.module,
                            Name = i.name,
                            SourcePath = i.file,
                        }
                }).ToList();

            foreach (var itm in lst)
            {
                itm.Registry.Dependencies = itm.depRefs.Select(d => lst.Single(l => l.id == d).Registry).ToList();
            }

            return lst.Select(i=>i.Registry).ToList();
        } 
    }
}