# PAN COVID-19
COVID-19 Statistics Dashboard

## Getting Started

### Prequisites

* Node.js 
```
https://nodejs.org/en/download/
```

* Python 3
```
https://www.python.org/downloads/
```

### Installation

1. Clone the repo
```sh
git clone https://github.com/stfurkan/pancovid19.git
```
2. Change directory to client
```sh
cd client
```
3. Install NPM packages
```sh
npm install
```

## Development and Deployment

### React (client)

* Change directory to client
```sh
cd client
```

#### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

#### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### Python 3 (python)

* Change directory to python
```sh
cd python
```
* Run createCovidJson.py file to create JSON files for the client
```sh
python3 createCovidJson.py
```
* Copy JSON files to client/src directory
```sh
cp covid.json ../client/src/.
cp graph.json ../client/src/.
cp updated.json ../client/src/.
```

* If you want to get most up to date data into the JSON files, you should update your datasets from [JHU CSSE](https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series).


## Features

* Shows total confirmed, recovered and death COVID-19 cases by country
* Shows daily statistics for every country
* Compares up to 4 countries
* Total data for all countries and daily data for every country can be exported as CSV
* Charts
* Map
* Supports Turkish and English languages (based on browser language)

## Built With

* [Node.js](https://nodejs.org/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
* [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
* [Python3](https://www.python.org/) - Python is a programming language that lets you work quickly
and integrate systems more effectively.

## Contributing

### `All contributions are welcome!`

1. Fork the project
2. Create your branch (`git checkout -b feature/featureName`)
3. Commit your changes (`git commit -m 'Short details about the change'`)
4. Push to the branch (`git push origin feature/featureName`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* This application uses the data provided by [JHU CSSE](https://github.com/CSSEGISandData/COVID-19).
