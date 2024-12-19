export function random(len: number) {
  let options = "abcdefghijklmnopqrstuvwxyz0123456789";
  let length = options.length;

  let result = "";

  for (let i = 0; i < len; i++) {
    result += options[Math.floor(Math.random() * length)]; // gives btw 0 => length-1
  }

  return result;
}
