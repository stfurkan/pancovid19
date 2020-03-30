#!/usr/bin/python3

import csv
import json
import datetime

countryTr = {"Afghanistan": "Afganistan",
"Albania": "Arnavutluk",
"Algeria": "Cezayir",
"Andorra": "Andorra",
"Angola": "Angola",
"Antigua and Barbuda": "Antigua ve Barbuda",
"Argentina": "Arjantin",
"Armenia": "Ermenistan",
"Australia": "Avustralya",
"Austria": "Avusturya",
"Azerbaijan": "Azerbeycan",
"Bahamas": "Bahamalar",
"Bahrain": "Bahreyn",
"Bangladesh": "Bangladeş",
"Barbados": "Barbados",
"Belarus": "Belarus",
"Belgium": "Belçika",
"Belize": "Belize",
"Benin": "Benin",
"Bhutan": "Butan",
"Bolivia": "Bolivya",
"Bosnia and Herzegovina": "Bosna Hersek",
"Brazil": "Brezilya",
"Brunei": "Brunei",
"Bulgaria": "Bulgaristan",
"Burkina Faso": "Burkina Faso",
"Burma": "Burma",
"Cabo Verde": "Cabo Verde",
"Cambodia": "Kamboçya",
"Cameroon": "Kamerun",
"Canada": "Kanada",
"Central African Republic": "Orta Afrika Cumhuriyeti",
"Chad": "Çad",
"Chile": "Şili",
"China": "Çin",
"Colombia": "Kolombiya",
"Congo (Brazzaville)": "Kongo (Brazzaville)",
"Congo (Kinshasa)": "Kongo (Kinşasa)",
"Costa Rica": "Kosta Rika",
"Cote d'Ivoire": "Fildişi Sahili",
"Croatia": "Hırvatistan",
"Cuba": "Küba",
"Cyprus": "Kıbrıs",
"Czechia": "Çekya",
"Denmark": "Danimarka",
"Diamond Princess": "Diamond Princess",
"Djibouti": "Cibuti",
"Dominica": "Dominika",
"Dominican Republic": "Dominik Cumhuriyeti",
"Ecuador": "Ekvador",
"Egypt": "Mısır",
"El Salvador": "El Salvador",
"Equatorial Guinea": "Ekvator Ginesi",
"Eritrea": "Eritre",
"Estonia": "Estonya",
"Eswatini": "Eswatini",
"Ethiopia": "Etiyopya",
"Fiji": "Fiji",
"Finland": "Finlandiya",
"France": "Fransa",
"Gabon": "Gabon",
"Gambia": "Gambiya",
"Georgia": "Gürcistan",
"Germany": "Almanya",
"Ghana": "Gana",
"Greece": "Yunanistan",
"Grenada": "Grenada",
"Guatemala": "Guatemala",
"Guinea": "Gine",
"Guinea-Bissau": "Gine-Bissau",
"Guyana": "Guyana",
"Haiti": "Haiti",
"Holy See": "Vatikan",
"Honduras": "Honduras",
"Hungary": "Macaristan",
"Iceland": "İzlanda",
"India": "Hindistan",
"Indonesia": "Endonezya",
"Iran": "İran",
"Iraq": "Irak",
"Ireland": "İrlanda",
"Israel": "İsrail",
"Italy": "İtalya",
"Jamaica": "Jamaika",
"Japan": "Japonya",
"Jordan": "Ürdün",
"Kazakhstan": "Kazakistan",
"Kenya": "Kenya",
"Korea, South": "Güney Kore",
"Kosovo": "Kosova",
"Kuwait": "Kuveyt",
"Kyrgyzstan": "Kırgızistan",
"Laos": "Laos",
"Latvia": "Letonya",
"Lebanon": "Lübnan",
"Liberia": "Liberya",
"Libya": "Libya",
"Liechtenstein": "Lihtenştayn",
"Lithuania": "Litvanya",
"Luxembourg": "Lüksemburg",
"Madagascar": "Madagaskar",
"Malaysia": "Malezya",
"Maldives": "Maldivler",
"Mali": "Mali",
"Malta": "Malta",
"Mauritania": "Moritanya",
"Mauritius": "Mauritius",
"Mexico": "Meksika",
"Moldova": "Moldova",
"Monaco": "Monako",
"Mongolia": "Moğolistan",
"Montenegro": "Karadağ",
"Morocco": "Fas",
"Mozambique": "Mozambik",
"Namibia": "Namibya",
"Nepal": "Nepal",
"Netherlands": "Hollanda",
"New Zealand": "Yeni Zelanda",
"Nicaragua": "Nikaragua",
"Niger": "Nijer",
"Nigeria": "Nijerya",
"North Macedonia": "Kuzey Makedonya",
"Norway": "Norveç",
"Oman": "Umman",
"Pakistan": "Pakistan",
"Panama": "Panama",
"Papua New Guinea": "Papua Yeni Gine",
"Paraguay": "Paraguay",
"Peru": "Peru",
"Philippines": "Filipinler",
"Poland": "Polonya",
"Portugal": "Portekiz",
"Qatar": "Katar",
"Romania": "Romanya",
"Russia": "Rusya",
"Rwanda": "Ruanda",
"Saint Kitts and Nevis": "Saint Kitts ve Nevis",
"Saint Lucia": "Saint Lucia",
"Saint Vincent and the Grenadines": "Saint Vincent ve Grenadinler",
"San Marino": "San Marino",
"Saudi Arabia": "Suudi Arabistan",
"Senegal": "Senegal",
"Serbia": "Sırbistan",
"Seychelles": "Seyşeller",
"Singapore": "Singapur",
"Slovakia": "Slovakya",
"Slovenia": "Slovenya",
"Somalia": "Somali",
"South Africa": "Güney Afrika",
"Spain": "İspanya",
"Sri Lanka": "Sri Lanka",
"Sudan": "Sudan",
"Suriname": "Surinam",
"Sweden": "İsveç",
"Switzerland": "İsviçre",
"Syria": "Suriye",
"Taiwan*": "Tayvan",
"Tanzania": "Tanzanya",
"Thailand": "Tayland",
"Timor-Leste": "Doğu Timor",
"Togo": "Togo",
"Trinidad and Tobago": "Trinidad ve Tobago",
"Tunisia": "Tunus",
"Turkey": "Türkiye",
"Uganda": "Uganda",
"Ukraine": "Ukrayna",
"United Arab Emirates": "Birleşik Arap Emirlikleri",
"United Kingdom": "Birleşik Krallık",
"Uruguay": "Uruguay",
"US": "Amerika Birleşik Devletleri",
"Uzbekistan": "Özbekistan",
"Venezuela": "Venezuela",
"Vietnam": "Vietnam",
"West Bank and Gaza": "Batı Şeria ve Gazze",
"Zambia": "Zambiya",
"Zimbabwe": "Zimbabve"
}

countryDict = {}

confirmedCsv = open('./datasets/time_series_covid19_confirmed_global.csv')
readerConfirmed = csv.reader(confirmedCsv)

for row in readerConfirmed:
    if row[0] == 'Province/State':
        pass
    else:
        province = str(row[0])
        country = str(row[1])
        latitude = float(row[2])
        longitude = float(row[3])

        if country in countryDict.keys():
            countryDict[country]["latitude"] += latitude
            countryDict[country]["longitude"] += longitude
            if latitude == 0 and longitude == 0:
                pass
            else:
                countryDict[country]["count"] += 1
        else:
            if country in countryTr:
                trCountry = countryTr[country]
            else:
                trCountry = country

            countryDict[country] = {
                "country": country,
                "countryTr": trCountry,
                "latitude": latitude,
                "longitude": longitude,
                "count": 1,
                "data": {}
            }

        date = datetime.date(2020, 1, 22)
        cnt = 0
        for i in row:
            strDate = str(date)
            if cnt > 3:
                if strDate in countryDict[country]["data"]:
                    countryDict[country]["data"][strDate]["confirmed"] += int(i)
                else:
                    countryDict[country]["data"][strDate] = {
                        "confirmed": int(i),
                        "recovered": 0,
                        "deaths": 0
                    }

                date = date + datetime.timedelta(days=1)
            cnt = cnt + 1


recoveredCsv = open('./datasets/time_series_covid19_recovered_global.csv')
readerRecovered = csv.reader(recoveredCsv)

for row in readerRecovered:
    if row[0] == 'Province/State':
        pass
    else:
        country = str(row[1])

        date = datetime.date(2020, 1, 22)
        cnt = 0
        for i in row:
            strDate = str(date)
            if cnt > 3:
                if strDate in countryDict[country]["data"]:
                    countryDict[country]["data"][strDate]["recovered"] += int(i)
                else:
                    countryDict[country]["data"][strDate]["recovered"] = int(i)

                date = date + datetime.timedelta(days=1)
            cnt = cnt + 1


deathCsv = open('./datasets/time_series_covid19_deaths_global.csv')
readerDeath = csv.reader(deathCsv)

for row in readerDeath:
    if row[0] == 'Province/State':
        pass
    else:
        country = str(row[1])

        date = datetime.date(2020, 1, 22)
        cnt = 0
        for i in row:
            strDate = str(date)
            if cnt > 3:
                if strDate in countryDict[country]["data"]:
                    countryDict[country]["data"][strDate]["deaths"] += int(i)
                else:
                    countryDict[country]["data"][strDate]["deaths"] = int(i)

                date = date + datetime.timedelta(days=1)
            cnt = cnt + 1


for country in countryDict:
    countryDict[country]["latitude"] = countryDict[country]["latitude"]/countryDict[country]["count"]
    countryDict[country]["longitude"] = countryDict[country]["longitude"]/countryDict[country]["count"]

    del countryDict[country]["count"]

countryList = []
for key in countryDict.keys():
    countryList.append(countryDict[key])


dailyGeneralData = {}
for key in countryDict.keys():
    for dayDate in countryDict[key]["data"]:
        dayObj = {x: countryDict[key]["data"][dayDate][x] for x in countryDict[key]["data"][dayDate].keys()}
        dayObj.update({"date": dayDate})

        if dayDate in dailyGeneralData:
            dailyGeneralData[dayDate]["confirmed"] += countryDict[key]["data"][dayDate]["confirmed"]
            dailyGeneralData[dayDate]["recovered"] += countryDict[key]["data"][dayDate]["recovered"]
            dailyGeneralData[dayDate]["deaths"] += countryDict[key]["data"][dayDate]["deaths"]
        else:
            dailyGeneralData[dayDate] = dayObj


dailyGeneralDataList = []
for key in dailyGeneralData.keys():
    dailyGeneralDataList.append(dailyGeneralData[key])


with open('covidDict.json', 'w') as jsonFile:
    json.dump(countryDict, jsonFile)

with open('covid.json', 'w') as jsonFile:
    json.dump(countryList, jsonFile)

with open('graph.json', 'w') as jsonFile:
    json.dump(dailyGeneralDataList, jsonFile)

lastUpdated = {"lastUpdated": datetime.datetime.utcnow().strftime("%d/%m/%Y %H:%M:%S") + " UTC"}
with open('updated.json', 'w') as jsonFile:
    json.dump(lastUpdated, jsonFile)
