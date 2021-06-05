import utf8 from "utf8";
import axios from "axios";

export async function setting(field) {
  try {
    await axios.get("paygo/settings").then((e) => {
      return e.data;
    });
  } catch (e) {
    console.log(e);
  }
}

export function makeid(length = 16, type = null) {
  if (type == "numb") {
    var result = "";
    var characters = "0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  } else {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

export function hideNumb(e) {
  var numb = String(e);
  //use slice to remove first 12 elements
  let first12 = numb.slice(4, numb.length - numb.length / 2);
  //define what char to use to replace numbers
  let char = "*";
  let repeatedChar = "";
  if (numb.length > 12) {
    repeatedChar = char.repeat(numb.length - numb.length / 2);
  } else {
    repeatedChar = char.repeat(numb.length - numb.length / 4);
  }
  // replace numbers with repeated char
  first12 = first12.replace(first12, repeatedChar);
  //concat hidden char with last 4 digits of input
  let hiddenNumbers = numb.slice(0, 4) + first12 + numb.slice(numb.length - 4);
  //return
  return hiddenNumbers;
}

export function get_image(image, clasor = null) {
  if (clasor != null) {
    return "https://admin.paygo.az/storage/uploads/" + clasor + "/" + image;
  }
  return "https://admin.paygo.az/storage/uploads/" + image;
}

export function convertaz(text = null) {
  if (text != null) {
    text = text.split("_");
    text = text[1];
    return checkUTF8(text);
  } else {
    return null;
  }
}

function checkUTF8(text) {
  var utf8Text = text;
  try {
    // Try to convert to utf-8
    utf8Text = decodeURIComponent(escape(text));
    // If the conversion succeeds, text is not utf-8
  } catch (e) {
    // console.log(e.message); // URI malformed
    // This exception means text is utf-8
  }
  return utf8Text; // returned text is always utf-8
}

export function string_to_slug(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
}

export function convertStampDate(unixtimestamp) {
  var months_arr = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "İyun",
    "İyul",
    "Avqust",
    "Sentyabr",
    "Oktyabr",
    "Noyabr",
    "Dekabr",
  ];

  var date = new Date(unixtimestamp * 1);

  var year = date.getFullYear();

  var month = months_arr[date.getMonth()];

  var day = date.getDate();

  var hours = date.getHours();

  var minutes = "0" + date.getMinutes();

  var seconds = "0" + date.getSeconds();

  var fulldate =
    day +
    " " +
    month +
    " " +
    year +
    " -Saat: " +
    hours +
    " : " +
    minutes.substr(-2);

  return fulldate;
}
