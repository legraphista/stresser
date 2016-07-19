# stresser

_Stress test your http endpoint in a cool way_

![Overview](https://github.com/legraphista/stresser/master/logo/logo.png)

___

## Requirements
- NodeJS 4+

___

## Installation

***NodeJS***

There are a number of ways to install node.
Please look into [NVM](https://github.com/creationix/nvm#installation) or [N](https://github.com/tj/n#installation) for a simple process

___

## Usage

After installing and configuring you can simply run:
```
stresser
```

The options are:
```
Usage: stresser <URL> [options]

    Options:
        -h | --help
            Outputs this helpful information
            
        --html=<path/to/report/file.html> [${path.join(__dirname, 'report', `report-${Date.now()}.html`)}]
            Outputs an HTML report file to location
            Set --html=false if you want to disable it

        -t | --timeout= <milliseconds> [10000]
            Sets the time a request waits for response

        -n | --count= <number> [10000]
            Sets the number of requests

        -c | --concurrent= <number> [100]
            Sets the number of concurrent requests

        -m | --method <GET|HEAD|POST|PUT|DELETE|*> [GET]
            Sets the request method
```

Example: 
`stresser http://example.com/page.html -c 500 -n 20000 -t 20000 --html=/home/reports/report-$(date +%s).html`

___

## Support

For bugs and/or feature requests please refer to the [Github page](https://github.com/legraphista/stresser).

___

## License

`stresser` plugin reporter is offered under MIT license. Please refer to [this page](https://github.com/legraphista/stresser/blob/master/LICENSE) for more info.
