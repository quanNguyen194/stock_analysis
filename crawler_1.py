import requests
from bs4 import BeautifulSoup as bs
import urllib.request as request

url1='https://finance.vietstock.vn/ant/ho-so-doanh-nghiep.htm'
url2='https://finance.vietstock.vn/ant/ho-so-doanh-nghiep.htm'
# page1 = request.urlopen(url1)
page2 = requests.get(url2)

# print(page1.read())
print(page2.status_code)
# soup = bs(page1.content, 'html.parser')

# print(soup)