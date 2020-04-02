#!/usr/bin/python3

import os
import json
import pandas as pd
import pmdarima as pm
import datetime


fileDir = os.getcwd()

with open(fileDir + '/covidDict.json') as f:
    data = json.load(f)

dateFormat = '%Y-%m-%d'

# Set forecast day count
forecastDays = 5

# Delete Serbia's data for now. It's recovery data needs correction.
del data['Serbia']

collectDeleteCountries = []

# Loop countries to create forecast data
for country in data:
    tempArray = [['Date', 'Confirmed', 'Recovered', 'Deaths']]
    for d in data[country]['data']:
        if data[country]['data'][d]['confirmed'] > 0:
            tempArray.append([d, data[country]['data'][d]['confirmed'], data[country]['data'][d]['recovered'], data[country]['data'][d]['deaths']])

        lastDay = d

    # If data is less than 10 days, drop the country data for now
    if len(tempArray) < 11:
        collectDeleteCountries.append(country)
        continue

    lastDay = datetime.datetime.strptime(lastDay, dateFormat)

    df = pd.DataFrame(tempArray[1:])
    df.columns = tempArray[0]

    df['Date']=pd.to_datetime(df['Date'])
    df.set_index('Date', inplace=True)

    # Forecast next 7 days for confirmed
    confirmed_model = pm.auto_arima(df['Confirmed'], start_p=1, start_q=1, max_p=3, max_q=3, start_P=0, seasonal=False, d=2, trace=True, error_action='ignore', suppress_warnings=True, stepwise=True)

    confirmed_model.fit(df['Confirmed'])

    forecast_confirmed = confirmed_model.predict(n_periods=forecastDays)

    # Forecast next 7 days for recovered
    recovered_model = pm.auto_arima(df['Recovered'], start_p=1, start_q=1, max_p=3, max_q=3, start_P=0, seasonal=False, d=2, trace=True, error_action='ignore', suppress_warnings=True, stepwise=True)

    recovered_model.fit(df['Recovered'])

    forecast_recovered = recovered_model.predict(n_periods=forecastDays)

    # Forecast next 7 days for deaths
    deaths_model = pm.auto_arima(df['Deaths'], start_p=1, start_q=1, max_p=3, max_q=3, start_P=0, seasonal=False, d=2, trace=True, error_action='ignore', suppress_warnings=True, stepwise=True)

    deaths_model.fit(df['Deaths'])

    forecast_deaths = deaths_model.predict(n_periods=forecastDays)

    for i in range (len(forecast_confirmed)):
        lastDay = lastDay + datetime.timedelta(days=1)
        data[country]['data'][str(lastDay.date())] = {
            'confirmed': int(round(forecast_confirmed[i])),
            'recovered': int(round(forecast_recovered[i])),
            'deaths': int(round(forecast_deaths[i])),
        }


# If data is less than 10 days, drop the country data for now
for c in collectDeleteCountries:
    del data[c]

countryList = []
for key in data.keys():
    countryList.append(data[key])


dailyGeneralData = {}
for key in data.keys():
    for dayDate in data[key]["data"]:
        dayObj = {x: data[key]["data"][dayDate][x] for x in data[key]["data"][dayDate].keys()}
        dayObj.update({"date": dayDate})

        if dayDate in dailyGeneralData:
            dailyGeneralData[dayDate]["confirmed"] += data[key]["data"][dayDate]["confirmed"]
            dailyGeneralData[dayDate]["recovered"] += data[key]["data"][dayDate]["recovered"]
            dailyGeneralData[dayDate]["deaths"] += data[key]["data"][dayDate]["deaths"]
        else:
            dailyGeneralData[dayDate] = dayObj


dailyGeneralDataList = []
for key in dailyGeneralData.keys():
    dailyGeneralDataList.append(dailyGeneralData[key])


with open('covidDictForecast.json', 'w') as jsonFile:
    json.dump(data, jsonFile)

with open('covidForecast.json', 'w') as jsonFile:
    json.dump(countryList, jsonFile)

with open('graphForecast.json', 'w') as jsonFile:
    json.dump(dailyGeneralDataList, jsonFile)

lastUpdated = {"lastUpdated": datetime.datetime.utcnow().strftime("%d/%m/%Y %H:%M:%S") + " UTC"}
with open('updated.json', 'w') as jsonFile:
    json.dump(lastUpdated, jsonFile)
