var fs = require('fs');

var replaceArray = [
  {
    file: 'node_modules/react-native-maps/react-native-google-maps.podspec',
    find: "s.dependency 'GoogleMaps', '6.1.1'",
    replace: "s.dependency 'GoogleMaps', '3.1.0'",
    special: true,
  },
  {
    file: 'node_modules/react-native-maps/react-native-google-maps.podspec',
    find: "s.dependency 'Google-Maps-iOS-Utils', '4.1.0'",
    replace: "s.dependency 'Google-Maps-iOS-Utils', '2.1.0'",
    special: true,
  },
];

replaceArray.forEach((replaceObj) => {
  fs.readFile(replaceObj.file, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    var sRegExInput = new RegExp(replaceObj.find, 'g');
    var result = data.replace(sRegExInput, replaceObj.replace);

    fs.writeFile(replaceObj.file, result, 'utf8', function (error) {
      if (err) return console.log(error);
      console.log('Written ===> ');
    });
  });
});
