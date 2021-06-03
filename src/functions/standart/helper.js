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

export function get_image(image) {
  return "http://admin.paygo.az/storage/uploads/" + image;
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
