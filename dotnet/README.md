# jsfac - dotnet
The server side jsfac library written for dotnet to resolve dependencies.

## Features
``` csharp
new jsfac("jsfac path", "scripts path") // init

jsfac.Find("module", "name") // find a registry
/*
returns JsfacRegistry {
	Module
	Name
	File
	Dependencies
}
*/
```