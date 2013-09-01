using System;
using System.Collections.Generic;
using Cassette.BundleProcessing;

namespace Jsfac.Cassette
{
    public class JsfacCommentParser : ICommentParser
    {
        readonly JsfacRegistry _registry;
        readonly Func<string, string> _virtualPathMapper;

        public JsfacCommentParser(JsfacRegistry registry, Func<string, string> virtualPathMapper)
        {
            _registry = registry;
            _virtualPathMapper = virtualPathMapper;
        }

        public IEnumerable<Comment> Parse(string code)
        {
            foreach (var dep in _registry.Dependencies)
            {
                var c = new Comment
                {
                    LineNumber = 0, //todo: do we need to specify line number?
                    Value = "@reference " + _virtualPathMapper(dep.SourcePath)
                };

                yield return c;
            }
        }
    }
}