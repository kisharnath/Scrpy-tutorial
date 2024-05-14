import scrapy


class PythonspiderSpider(scrapy.Spider):
    name = "pythonspider"
    allowed_domains = ["en.wikipedia.org"]
    start_urls = ["https://en.wikipedia.org/wiki/Python_(programming_language)"]

    def parse(self, response):
        headline = response.css('span.mw-page-title-main::text').get()
        print('------------------Output-------------------')
        print(headline)
        print('------------------Output-------------------')
