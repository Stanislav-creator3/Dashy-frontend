export default function greeting(userName?: string): string {
  const date = new Date();
  const hours = date.getHours();
  let str;
  if (hours < 12 && hours > 5) {
    str = "Доброе утро";
  } else if (hours >= 12 && hours < 18) {
    str = "Добрый день";
  } else if (hours >= 18 && hours < 23) {
    str = "Добрый вечер";
  } else {
    str = "Доброй ночи";
  }

  return `${str}${userName ? `, ${userName}` : ""}`;
}
