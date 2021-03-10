from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import pandas as pd
import time

# MAX_PAGES = 2

chrome_options = Options()
chrome_options.add_argument("--incognito")
chrome_options.add_argument("--start-maximized")
# chrome_options.add_argument("--headless")

driver = webdriver.Chrome(chrome_options=chrome_options, executable_path="/usr/local/bin/chromedriver")
url = 'https://finance.vietstock.vn/doanh-nghiep-a-z/?page=1'


# print(url)

def webstock_login(driver):
    driver.find_element_by_xpath('/html/body/div[2]/div[6]/div/div[2]/div[2]/a[2]').click()
    driver.find_element_by_xpath('//*[@id="txtEmailLogin"]').send_keys('quanntm.ilec@gmail.com')
    driver.find_element_by_xpath('//*[@id="txtPassword"]').send_keys('Mq190498')
    driver.find_element_by_xpath('//*[@id="btnLoginAccount"]').click()

    print('Account loged in successfully')
def page_parser(code_list, name_list):
    # Crawl all codes and names and append them to 2 lists
    codes = driver.find_elements_by_xpath('//*[@id="az-container"]/div[2]/table/tbody/tr/td[2]')
    names = driver.find_elements_by_xpath('//*[@id="az-container"]/div[2]/table/tbody/tr/td[3]')
    for j in range(len(codes)):
        code_list.append(codes[j].text)
        name_list.append(names[j].text)

    # After that go on to the next page
    driver.find_element_by_xpath('//*[@id="btn-page-next"]').click()
    time.sleep(2)
def enterprise_list_crawler(driver, url):
    driver.get(url)
    time.sleep(5)
    webstock_login(driver)
    time.sleep(3)
    code_list = []
    name_list = []
    totalPage = driver.find_element_by_xpath('//*[@id="az-container"]/div[3]/div[2]/div/span[1]/span[2]').text
    MAX_PAGES = int(totalPage)
    print('Page 1/'+totalPage)
    page_parser(code_list,name_list)
    for i in range(MAX_PAGES):
        print('Page' + str(i+2) + '/' + totalPage)
        page_parser(code_list, name_list)


    d = {'codes': code_list, 'names': name_list}
    df = pd.DataFrame(data=d)
    df.to_csv('enterprise_list.csv')
    return df


def enterprise_details():
    df = pd.read_csv('enterprise_list.csv')
    titles = []
    abouts = []
    traded_list = []
    capital = []
    listed_amount = []
    circulating_amount = []

    for i in range(len(df.codes)):
        url2 = 'https://finance.vietstock.vn/' + df.codes[i] + '/ho-so-doanh-nghiep.htm'
        driver.get(url2)
        time.sleep(2)
        # title = driver.find_element_by_xpath('//*[@id="page-container"]/div[2]/div[1]/div[1]/h1')
        about = driver.find_element_by_xpath('//*[@id="view-content"]/div[2]/div[1]/div[1]/div[2]/div')
        traded = driver.find_element_by_xpath('//*[@id="totalvol"]')
        cap = driver.find_element_by_xpath('//*[@id="page-container"]/div[2]/div[1]/div[4]/div/div[2]/p[5]/b')
        listed = driver.find_element_by_xpath('//*[@id="view-content"]/div[2]/div[2]/div[1]/p[4]/span')
        circulating = driver.find_element_by_xpath('//*[@id="view-content"]/div[2]/div[2]/div[1]/p[5]/span')

        # titles.append(title.text)
        abouts.append(about.text)
        traded_list.append(traded.text)
        capital.append(cap.text)
        listed_amount.append(listed.text)
        circulating_amount.append(circulating.text)

        print('Done ' + df.codes[i] + '(' + df.names[i] + ')')

    d = {'codes': df.codes,
         'names': df.names,
         'about': abouts,
         'capital': capital,
         'traded': traded_list,
         'listed_amount': listed_amount,
         'circulating_amount': circulating_amount}
    df = pd.DataFrame(data=d)
    df.to_csv('enterprise_details.csv')


enterprise_list_crawler(driver, url)
enterprise_details()
driver.close()
