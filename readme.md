# stresser

_Stress test your http endpoint in a cool way_

![Overview](https://raw.githubusercontent.com/legraphista/stresser/master/logo/logo.png)

___

## Install

`npm i -g stresser`

_For legacy v1 documentation please go [here](https://github.com/legraphista/stresser/tree/v1)_
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

        -t | --timeout= <milliseconds> [10000]
            Sets the time a request waits for response

        -n | --count= <number> [10]
            Sets the number of seconds

        -c | --concurrent= <number> [100]
            Sets the number of concurrent requests

        -m | --method <GET|HEAD|POST|PUT|DELETE|*> [GET]
            Sets the request method

        -f | --force
            Forces the stress test to stop at the requested time even if requests have not finished

        -v | --verbose <e|b|c>
            Sets verbosity
                - e: Errors
                - c: HTTP Status Codes
                - b: HTTP body

        --html=<path/to/report/file.html> [${path.join(__dirname, 'report', `report-${Date.now()}.html`)}]
            Outputs an HTML report file to location
            Set --html=false if you want to disable it

        --threads=<number> [#cpus]
            The number of cpus that will be used to stress test
```

Example:

`stresser http://example.com/page.html -c 10000 -n 10 -t 20000 --html=/home/reports/report-$(date +%s).html --threads=16 --force`

___

## Reading the stats
_Example:_
```
  S=    10 |   T=    96 | A=     0
  E=     0 | T/O=    96 | W/B=     0 | AVG=     0 | MIN=     0 | MAX=     0
1xx=     0 | 2xx=     0 | 3xx=     0 | 4xx=     0 | 5xx=     0
```

### Legend:
 - S   = Number of Seconds since the test was started
 - T   = Number of requests completed in the given amount of time
 - A   = Number of requests active (still awaiting a response)
 
 - E   = Number of requests failed 
 - T/O = Number of requests timed out
 - W/B = Number of requests that contain a response body
 - AVG = Average response time in milliseconds
 - MIN = Minimum response time in milliseconds
 - MAX = Maximum response time in milliseconds
 
 - 1xx = Number of HTTP code 100-199 responses
 - 2xx = Number of HTTP code 200-299 responses
 - 3xx = Number of HTTP code 300-399 responses
 - 4xx = Number of HTTP code 400-499 responses
 - 5xx = Number of HTTP code 500-599 responses

## HTML output
The HTML file contains:
 - Aggregated stats described above
 - A bar chart with distribution of the response times
 - A line chart with second by second stats

___

## Support

For bugs and/or feature requests please refer to the [Github page](https://github.com/legraphista/stresser).

___

## Roadmap
 - Implement option to send custom headers and custom body payload
 - Add pie chart with different http codes distribution 
 - Implement a slave / master system in order to stress test from multiple machines, for tests big enough (10k+) where the hardware becomes a bottleneck
___

## License

`stresser` is offered under MIT license. Please refer to [this page](https://github.com/legraphista/stresser/blob/master/LICENSE) for more info.
