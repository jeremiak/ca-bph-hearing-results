# Board of Parole suitability hearing results scraper

_Source_: [CA BPH](https://www.cdcr.ca.gov/bph/parole-suitability-hearing-results/)

[![Scrape BPH hearing results](https://github.com/jeremiak/ca-bph-scraper/actions/workflows/hearing-results.yml/badge.svg)](https://github.com/jeremiak/ca-bph-scraper/actions/workflows/hearing-results.yml)

## Methodology

This scraper runs [once a day](https://github.com/jeremiak/ca-bph-scraper/actions/workflows/hearing-results.yml) and checks the [BPH site](https://www.cdcr.ca.gov/bph/parole-suitability-hearing-results/) for the list titled "Hearing Results by Month". The first month in the list, which is sorted in reverse chronological order, is used to find the results table. [Here is an example for March 2022](https://www.cdcr.ca.gov/bph/2022/03/16/hearing-results-march-2022/). The results are extracted and merged in with all the previous results and saved to `hearing-results.json` in chronological order.