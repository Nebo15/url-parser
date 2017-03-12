# URL Parser

[![Greenkeeper badge](https://badges.greenkeeper.io/Nebo15/url-parser.svg)](https://greenkeeper.io/)

Small JS URL parser. 

### Support

- Simple query params
- PHP query arrays
- Nested object 
- Angular JS wrapper

## Installation

```
bower install nebo-url-parser --save
```

## Usage

```
var link = new URLParser('http://sub.domain.com:8080/test/route?query=10&arr[]=10&arr[]=20&obj.a=a&obj.b=b#!/somehash');

/* link object
{
  hash: "#!/somehash",
  host: "sub.domain.com:8080",
  hostname: "sub.domain.com",
  href: "http://sub.domain.com:8080/test/route?query=10&arr[]=10&arr[]=20&obj.a=a&obj.b=b#!/somehash",
  params: {
    arr: ["10", "20"],
    obj: {
      a: "a",
      b: "b"
    },
    query: "10"
  },
  pathname: "/test/route",
  port: "8080",
  protocol: "http:"
}
*/

link.params.obj.a = 'c';
var href = link.toString();
```

Angular JS

```
angular.module('app', [
  ...,
  'url-parser'
]);
```

See example on [JSBin](https://jsbin.com/sogacokite/edit)

## Documentation

### Properties

`params` - object with search params   
`href` - full original  url  
`protocol` - url protocol  
`hostname` - hostname  
`port` - hostname  
`pathname` - pathname  
`search` - query string  
`hash` - url hash  


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

**25.04.2016**

Init project

## Credits

Alexey Bondarenko (http://bondalex.com) created this!

## License

See [LICENSE-MIT](../LICENSE-MIT)
