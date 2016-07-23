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

## Support

For bugs and/or feature requests please refer to the [Github page](https://github.com/legraphista/stresser).

___

## License

`stresser` plugin reporter is offered under MIT license. Please refer to [this page](https://github.com/legraphista/stresser/blob/master/LICENSE) for more info.
