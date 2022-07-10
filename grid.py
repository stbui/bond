import requests


basePrice = 145
amount = 10000
gs = 50


def sell(price):
    global basePrice
    global amount
    global gs

    amount = amount + (price-basePrice)*10
    gs -= 10

    print('sell: ', gs, amount, basePrice)


def buy(price):
    global basePrice
    global amount
    global gs

    amount = amount - (basePrice-price)*10
    gs += 10

    print('buy: ', gs, amount, basePrice)


def grid(price):
    global basePrice

    distance = price-basePrice
    if distance > 0:
        risePrice = basePrice*1.01
        if price > risePrice:
            sell(price)
            basePrice = risePrice

    if distance < 0:
        downPrice = basePrice/1.01
        if price < downPrice:
            buy(price)
            basePrice = downPrice


url = 'https://api.duishu.com/hangqing/stock/fenshi?code=113575&time_type=F&from=0&to=0&is_include_from=0&is_include_to=1&get_pankou=0&get_zhutu=1&zhutu_zhibiao=&futu_zhibiaos=%E6%88%90%E4%BA%A4%E9%87%8F,MACD&get_lhb=0&config=&is_use_config=0&ext_params=&backgroundcolor=black&platform=pcclient'
res = requests.get(url=url)
if res.status_code == 200:
    data = res.json()['data']['zhutu']['left_line_list'][0]['data']
    with open('113575.json', 'wb') as file:
        file.write(res.content)

    for value in data:
        grid(value)

print(0.1*0.2)